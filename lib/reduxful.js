import update from 'immutability-helper'

const pathKeys = (path) => path.slice(1).split("/")

export class Store {
  static actions = {
    POST: (data) => ({ $push: [data] }),
    PATCH: (data) => ({ $merge: data }),
    DELETE: (index) => ({ $splice: [[index, 1]] }),
  }

  constructor(initialState = {}) {
    this.state = initialState
  }

  mutate(pathKeys, operation) {
    const reversedPathKeys = pathKeys.reverse()
    const mutation = reversedPathKeys.reduce((mutation, key) => ({ [key]: mutation }), operation)

    this.state = update(this.state, mutation)
    return this.state
  }

  POST(path, data) {
    return this.mutate(pathKeys(path), Store.actions.POST(data))
  }

  PATCH(path, data) {
    return this.mutate(pathKeys(path), Store.actions.PATCH(data))
  }

  DELETE(path) {
    const keys = pathKeys(path)
    const index = keys.pop()
    return this.mutate(keys, Store.actions.DELETE(index))
  }
}

export default {
  Store,
}
