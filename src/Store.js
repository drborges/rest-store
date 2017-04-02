import update from "immutability-helper"

const actions = {
  map: (fn) => ({ $apply: fn }),
  set: (data) => ({ $set: data }),
  merge: (data) => ({ $merge: data }),
  delete: (index) => ({ $splice: [[index, 1]] }),
}

const applyMutation = (state, path, operation) => {
  const reversedPathNodes = path.reversedNodes()
  const mutation = reversedPathNodes.reduce((mutation, key) => ({ [key]: mutation }), operation)
  return update(state, mutation)
}

export default class Store {
  constructor(state = {}) {
    this.state = state
  }

  get(path) {
    try {
      return path.walk(this.state)
    } catch(e) {
      throw `404: Path ${path} is not valid`
    }
  }

  put(path, value) {
    this.state = applyMutation(this.state, path, actions.set(value))
  }

  patch(path, value) {
    this.state = applyMutation(this.state, path, actions.merge(value))
  }

  map(path, fn) {
    this.state = applyMutation(this.state, path, actions.map(fn))
  }

  delete(path, index) {
    this.state = applyMutation(this.state, path, actions.delete(index))
  }
}