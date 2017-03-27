import update from 'immutability-helper'

const pathKeys = (path) => path.slice(1).split("/")

const actions = {
  post: (data) => ({ $push: [data] }),
  patch: (data) => ({ $merge: data }),
  put: (data) => ({ $set: data }),
  delete: (index) => ({ $splice: [[index, 1]] }),
}

export class Store {
  constructor(initialState = {}) {
    this.state = initialState
  }

  mutate(pathKeys, operation) {
    const reversedPathKeys = pathKeys.reverse()
    const mutation = reversedPathKeys.reduce((mutation, key) => ({ [key]: mutation }), operation)

    this.state = update(this.state, mutation)
    return this.state
  }

  post(path, data) {
    return this.mutate(pathKeys(path), actions.post(data))
  }

  put(path, data) {
    return this.mutate(pathKeys(path), actions.put(data))
  }

  patch(path, data) {
    return this.mutate(pathKeys(path), actions.patch(data))
  }

  delete(path) {
    const keys = pathKeys(path)
    const index = keys.pop()
    return this.mutate(keys, actions.delete(index))
  }
}

export default {
  Store,
}
