export const destructPath = (path) => path.slice(1).split("/")
export const nextPath = (path, next) => `${path}/${next}`

export const createResource = (store, path = "", currentVal = store.get(path)) => {
  return Array.isArray(currentVal) ?
    createCollectionResource(store, path, currentVal) :
    createMemberResource(store, path, currentVal)
}

const createMemberResource = (store, path, currentVal) => {
  const proxy = new Proxy(store.get(path), {
    get: function(target, prop, receiver) {
      const delegates = ["merge", "val"]
      const delegation = delegates.find((delegate) => delegate.toString() === prop.toString())

      if (delegation) {
        return this[delegation]
      }

      return createResource(store, nextPath(path, prop))
    },

    set: function(target, prop, value) {
      store.put(nextPath(path, prop), value)
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

export const createCollectionResource = (store, path, currentVal, currentIndex = 0) => {
  const proxy = new Proxy(store.get(path), {
    length: currentVal.length,

    get: function(target, prop, receiver) {
      const delegates = [Symbol.iterator, "push", "val", "remove", "map", "length", "slice"]
      const delegation = delegates.find((delegate) => delegate.toString() === prop.toString())

      if (delegation) {
        return this[delegation]
      }

      return createResource(store, nextPath(path, prop))
    },

    set: function(target, prop, value) {
      store.put(nextPath(path, prop), value)
      return true
    },

    slice: (start, len) => {
      return createCollectionResource(store, path, currentVal.slice(currentIndex + start, len), currentIndex + start)
    },

    val: () => {
      return currentVal
    },

    push: (value) => {
      store.post(path, value)
    },

    remove: (index) => {
      store.delete(nextPath(path, index))
    },

    map: (fn) => {
      return currentVal.slice(currentIndex).map((val, i) => {
        return fn(createResource(store, nextPath(path, i), val))
      })
    },

    [Symbol.iterator]: function* () {
      const len = this.length
      for (let i = 0; i < len; i++) {
        yield createResource(store, nextPath(path, currentIndex + i))
      }
    },
  })

  return proxy
}
