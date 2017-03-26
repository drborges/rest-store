import update from 'immutability-helper'

const pathKeys = (path) => path.slice(1).split("/")

const actions = {
  POST: (data) => ({ $push: [data] }),
  PATCH: (data) => ({ $merge: data }),
  PUT: (data) => ({ $set: data }),
  DELETE: (index) => ({ $splice: [[index, 1]] }),
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

  POST(path, data) {
    return this.mutate(pathKeys(path), actions.POST(data))
  }

  PUT(path, data) {
    return this.mutate(pathKeys(path), actions.PUT(data))
  }

  PATCH(path, data) {
    return this.mutate(pathKeys(path), actions.PATCH(data))
  }

  DELETE(path) {
    const keys = pathKeys(path)
    const index = keys.pop()
    return this.mutate(keys, actions.DELETE(index))
  }
}

export default {
  Store,
}
