import update from 'immutability-helper'

const pathKeys = (path) => path.slice(1).split("/")

const actions = {
  map: (fn) => ({ $apply: fn }),
  post: (data) => ({ $push: [data] }),
  patch: (data) => ({ $merge: data }),
  put: (data) => ({ $set: data }),
  delete: (index) => ({ $splice: [[index, 1]] }),
}

export class Store {
  constructor(initialState = {}) {
    this.state = initialState
  }

  applyMutation(pathKeys, operation) {
    const reversedPathKeys = pathKeys.reverse()
    const mutation = reversedPathKeys.reduce((mutation, key) => ({ [key]: mutation }), operation)

    this.state = update(this.state, mutation)
  }

  get(path) {
    const pathKeys = path.slice(1).split("/")
    return pathKeys.reduce((subtree, nextKey) => subtree[nextKey], this.state)
  }

  map(path, fn) {
    this.applyMutation(pathKeys(path), actions.map(fn))
  }

  post(path, data) {
    this.applyMutation(pathKeys(path), actions.post(data))
  }

  put(path, data) {
    this.applyMutation(pathKeys(path), actions.put(data))
  }

  patch(path, data) {
    this.applyMutation(pathKeys(path), actions.patch(data))
  }

  delete(path) {
    const keys = pathKeys(path)
    this.applyMutation(keys, actions.delete(keys.pop()))
  }

  resources() {
    let pathKeys = []
    const store = this
    const path = (pathKeys) => `/${pathKeys.join("/")}`
    const resetAfterExecution = (fn) => (arg) => {
      const result = fn(arg)
      pathKeys = []
      return result
    }

    const proxy = new Proxy(this.state, {
      get: function(target, prop, receiver) {
        const delegates = ["push", "merge", "fetch", "delete"]
        const delegation = delegates.find((delegate) => delegate === prop)

        if (delegation) {
          return this[delegation]
        }

        pathKeys.push(prop)
        return proxy
      },

      deleteProperty: function(target, prop) {
        pathKeys.push(prop)
        this.delete()
        return true
      },

      set: function(target, prop, value) {
        pathKeys.push(prop)
        store.put(path(pathKeys), value)
        pathKeys = []
        return true
      },

      fetch: resetAfterExecution(() => {
        return store.get(path(pathKeys))
      }),

      push: resetAfterExecution((value) => {
        store.post(path(pathKeys), value)
      }),

      merge: resetAfterExecution((value) => {
        store.patch(path(pathKeys), value)
      }),

      delete: resetAfterExecution(() => {
        store.delete(path(pathKeys))
      }),
    })

    return proxy
  }
}

export default {
  Store,
}
