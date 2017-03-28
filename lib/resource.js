export const destructPath = (path) => path.slice(1).split("/")
export const buildPath = (parts) => `/${parts.join("/")}`
export const createResource = (store, pathParts = [], val = null) => {
  const path = buildPath(pathParts)
  const currentVal = val || store.get(path)
  const proxy = new Proxy(store.get(path), {
    length: currentVal.length,

    get: function(target, prop, receiver) {
      const delegates = [Symbol.iterator, "push", "merge", "val", "delete", "map", "length", "slice"]
      const delegation = delegates.find((delegate) => delegate.toString() === prop.toString())

      if (delegation) {
        return this[delegation]
      }

      return createResource(store, [...pathParts, prop])
    },

    deleteProperty: function(target, prop) {
      createResource(store, [...pathParts, prop]).delete()
      return true
    },

    set: function(target, prop, value) {
      const path = buildPath([...pathParts, prop])
      store.put(path, value)
      return true
    },

    slice: (start, len) => {
      return createResource(store, pathParts, currentVal.slice(start, len))
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

    delete: () => {
      store.delete(path)
    },

    map: (fn) => {
      return currentVal.map((_, i) => {
        const itemPathParts = [ ...pathParts, i ]
        return fn(createResource(store, itemPathParts))
      })
    },

    [Symbol.iterator]: function* () {
      const len = this.length
      for (let i = 0; i < len; i++) {
        yield createResource(store, [...pathParts, i])
      }
    },
  })

  return proxy
}
