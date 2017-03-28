export const destructPath = (path) => path.slice(1).split("/")
export const buildPath = (parts) => `/${parts.join("/")}`

export const createResource = (store, pathParts = [], currentVal = store.get(buildPath(pathParts))) => {
  return Array.isArray(currentVal) ?
    createCollectionResource(store, pathParts, currentVal) :
    createMemberResource(store, pathParts, currentVal)
}

const createMemberResource = (store, pathParts, currentVal) => {
  const path = buildPath(pathParts)
  const proxy = new Proxy(store.get(path), {
    get: function(target, prop, receiver) {
      const delegates = ["merge", "val"]
      const delegation = delegates.find((delegate) => delegate.toString() === prop.toString())

      if (delegation) {
        return this[delegation]
      }

      return createResource(store, [...pathParts, prop])
    },

    set: function(target, prop, value) {
      const path = buildPath([...pathParts, prop])
      store.put(path, value)
      return true
    },

    val: () => {
      return currentVal
    },

    merge: (value) => {
      store.patch(path, value)
    },
  })

  return proxy
}

export const createCollectionResource = (store, pathParts, currentVal, currentIndex = 0) => {
  const path = buildPath(pathParts)
  const proxy = new Proxy(store.get(path), {
    length: currentVal.length,

    get: function(target, prop, receiver) {
      const delegates = [Symbol.iterator, "push", "merge", "val", "remove", "map", "length", "slice"]
      const delegation = delegates.find((delegate) => delegate.toString() === prop.toString())

      if (delegation) {
        return this[delegation]
      }

      return createResource(store, [...pathParts, prop])
    },

    set: function(target, prop, value) {
      store.put(buildPath([...pathParts, prop]), value)
      return true
    },

    slice: (start, len) => {
      return createCollectionResource(store, pathParts, currentVal.slice(currentIndex + start, len), currentIndex + start)
    },

    val: () => {
      return currentVal
    },

    push: (value) => {
      store.post(path, value)
    },

    merge: (value) => {
      store.patch(path, value)
    },

    remove: (index) => {
      store.delete(buildPath([...pathParts, index]))
    },

    map: (fn) => {
      return currentVal.slice(currentIndex).map((val, i) => {
        const itemPathParts = [ ...pathParts, i ]
        return fn(createResource(store, itemPathParts, val))
      })
    },

    [Symbol.iterator]: function* () {
      const len = this.length
      for (let i = 0; i < len; i++) {
        yield createResource(store, [...pathParts, currentIndex + i])
      }
    },
  })

  return proxy
}
