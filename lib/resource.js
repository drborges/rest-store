export const destructPath = (path) => path.slice(1).split("/")
export const nextPath = (path, next) => `${path}/${next}`

export const createResource = (store, path = "") => {
  return Array.isArray(store.get(path)) ?
    createResourceCollection(store, path) :
    createResourceMember(store, path)
}

const createResourceMember = (store, path) => {
  return new Proxy({}, {
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
      return store.get(path)
    },

    merge: (value) => {
      store.patch(path, value)
    },
  })
}

export const createResourceCollection = (store, path, view = Object.keys(store.get(path))) => {
  return new Proxy([], {
    length: view.length,

    get: function(target, prop, receiver) {
      const delegates = [Symbol.iterator, "push", "val", "remove", "map", "filter", "length", "slice"]
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

    slice: (begin, end) => {
      return createResourceCollection(store, path, view.slice(begin, end))
    },

    val: () => {
      return store.get(path).filter((_, i) => view.includes(i.toString()))
    },

    push: (value) => {
      store.post(path, value)
    },

    remove: (index) => {
      store.delete(nextPath(path, index))
    },

    map: (fn) => {
      return view.map(index => fn(createResource(store, nextPath(path, index))))
    },

    filter: (fn) => {
      const filteredView = proxy.val().map((item, i) => fn(item) ? i : null).filter(index => index)

      return createResourceCollection(store, path, filteredView)
    },

    [Symbol.iterator]: function* () {
      for (let i = 0; i < view.length; i++) {
        yield createResource(store, nextPath(path, view[i]))
      }
    },
  })
}
