export const nextPath = (path, next) => [...path, next]

export const createResource = (store, path = []) => {
  return Array.isArray(store.get(path)) ?
    createResourceCollection(store, path) :
    createResourceMember(store, path)
}

const createResourceMember = (store, path) => {
  return new Proxy({}, {
    get(target, prop, receiver) {
      const delegates = ["merge", "val", "parent"]
      const delegation = delegates.find((delegate) => delegate.toString() === prop.toString())

      if (delegation) {
        return this[delegation]
      }

      return createResource(store, nextPath(path, prop))
    },

    set(target, prop, value) {
      store.put(nextPath(path, prop), value)
      return true
    },

    val() {
      return store.get(path)
    },

    merge(value) {
      store.patch(path, value)
    },

    parent() {
      if (path.length == 0) {
        return undefined
      }

      const parentPath = path.slice(0, path.length - 1)
      return createResource(store, parentPath)
    },
  })
}

const createResourceCollection = (store, path, view = Object.keys(store.get(path))) => {
  return new Proxy([], {
    length: view.length,

    get(target, prop, receiver) {
      const delegates = [Symbol.iterator, "push", "val", "remove", "map", "filter", "length", "slice", "parent"]
      const delegation = delegates.find((delegate) => delegate.toString() === prop.toString())

      if (delegation) {
        return this[delegation]
      }

      return createResource(store, nextPath(path, prop))
    },

    set(target, prop, value) {
      store.put(nextPath(path, prop), value)
      return true
    },

    slice(begin, end) {
      return createResourceCollection(store, path, view.slice(begin, end))
    },

    val() {
      return store.get(path).filter((_, i) => view.includes(i.toString()))
    },

    push(value) {
      store.post(path, value)
    },

    remove(index) {
      store.delete(nextPath(path, index))
    },

    map(fn) {
      return view.map(index => fn(createResource(store, nextPath(path, index))))
    },

    filter(fn) {
      const filteredView = this.val().
        map((item, i) => fn(item) ? i : null).
        filter(index => index)

      return createResourceCollection(store, path, filteredView)
    },

    *[Symbol.iterator]() {
      for (let i = 0; i < view.length; i++) {
        yield createResource(store, nextPath(path, view[i]))
      }
    },

    parent() {
      const parentPath = path.slice(0, path.length - 1)
      return createResource(store, parentPath)
    },
  })
}
