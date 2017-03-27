export const pathParts = (path) => path.slice(1).split("/")
export const path = (pathParts) => `/${pathParts.join("/")}`
export const createResource = (store, pathParts = []) => {
  const proxy = new Proxy(store.state, {
    get: function(target, prop, receiver) {
      const delegates = ["push", "merge", "fetch", "delete", "map"]
      const delegation = delegates.find((delegate) => delegate === prop)

      if (delegation) {
        return this[delegation]
      }

      return createResource(store, [...pathParts, prop])
    },

    deleteProperty: function(target, prop) {
      pathParts.push(prop)
      this.delete()
      return true
    },

    set: function(target, prop, value) {
      pathParts.push(prop)
      store.put(path(pathParts), value)
      pathParts = []
      return true
    },

    fetch: () => {
      return store.get(path(pathParts))
    },

    push: (value) => {
      store.post(path(pathParts), value)
    },

    merge: (value) => {
      store.patch(path(pathParts), value)
    },

    delete: () => {
      store.delete(path(pathParts))
    },

    map: (fn) => {
      return store.get(path(pathParts)).map((_, i) => {
        const itemPathParts = [ ...pathParts, i ]
        return fn(createResource(store, itemPathParts))
      })
    },
  })

  return proxy
}
