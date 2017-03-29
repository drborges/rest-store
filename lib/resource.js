const nextPath = (path, next) => [...path, next]
const computeDelegation = (resource, prop) => {
  const proxyAPI = ["get", "set"]
  const delegates = [
    ...Object.keys(resource).filter(key => !proxyAPI.includes(key)),
    ...Object.getOwnPropertySymbols(resource),
  ]

  return delegates.find((delegate) => delegate.toString() === prop.toString())
}

const resourceCommonAPI = (store, path) => ({
  get(target, prop, receiver) {
    const delegation = computeDelegation(this, prop)

    if (delegation) {
      return this[delegation]
    }

    return createResource(store, nextPath(path, prop))
  },

  set(target, prop, value) {
    store.put(nextPath(path, prop), value)
    return true
  },

  parent() {
    if (path.length == 0) {
      return undefined
    }

    const parentPath = path.slice(0, path.length - 1)
    return createResource(store, parentPath)
  },
})

const createResourceMember = (store, path) => {
  return new Proxy({}, {
    ...resourceCommonAPI(store, path),

    val() {
      return store.get(path)
    },

    merge(value) {
      store.patch(path, value)
    },
  })
}

const createResourceCollection = (store, path, view = Object.keys(store.get(path))) => {
  return new Proxy([], {
    ...resourceCommonAPI(store, path),

    length: view.length,

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
      for (let index of view) {
        yield createResource(store, nextPath(path, index))
      }
    },
  })
}

export default function createResource(store, path = []) {
  return Array.isArray(store.get(path)) ?
    createResourceCollection(store, path) :
    createResourceMember(store, path)
}
