export const pathParts = (path) => path.slice(1).split("/")
export const path = (pathParts) => `/${pathParts.join("/")}`
export const createResource = (store, pathParts = []) => {
  const resetAfterExecution = (fn) => (arg) => {
    const result = fn(arg)
    pathParts = []
    return result
  }

  const proxy = new Proxy(store.state, {
    get: function(target, prop, receiver) {
      const delegates = ["push", "merge", "fetch", "delete", "map"]
      const delegation = delegates.find((delegate) => delegate === prop)

      if (delegation) {
        return this[delegation]
      }

      pathParts.push(prop)
      return proxy
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

    fetch: resetAfterExecution(() => {
      return store.get(path(pathParts))
    }),

    push: resetAfterExecution((value) => {
      store.post(path(pathParts), value)
    }),

    merge: resetAfterExecution((value) => {
      store.patch(path(pathParts), value)
    }),

    delete: resetAfterExecution(() => {
      store.delete(path(pathParts))
    }),

    map: resetAfterExecution((fn) => {
      return store.get(path(pathParts)).map((_, i) => {
        const itemPathParts = [ ...pathParts, i ]
        return fn(createResource(store, itemPathParts))
      })
    }),
  })

  return proxy
}
