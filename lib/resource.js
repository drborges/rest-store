export const destructPath = (path) => path.slice(1).split("/")
export const buildPath = (parts) => `/${parts.join("/")}`
export const createResource = (store, pathParts = []) => {
  const path = buildPath(pathParts)
  const proxy = new Proxy(store.state, {
    get: function(target, prop, receiver) {
      const delegates = ["push", "merge", "val", "delete", "map"]
      const delegation = delegates.find((delegate) => delegate === prop)

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

    val: () => {
      return store.get(path)
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
      return store.get(path).map((_, i) => {
        const itemPathParts = [ ...pathParts, i ]
        return fn(createResource(store, itemPathParts))
      })
    },
  })

  return proxy
}
