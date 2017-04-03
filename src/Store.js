import update from "immutability-helper"
import Path from "./Path"
import { createMutator } from "./mutators"

const actions = {
  map: (fn) => ({ $apply: fn }),
  set: (data) => ({ $set: data }),
  merge: (data) => ({ $merge: data }),
  delete: (index) => ({ $splice: [[index, 1]] }),
}

const applyMutation = (state, path, operation) => {
  const reversedPathNodes = [...path].reverse()
  const mutation = reversedPathNodes.reduce((mutation, key) => ({ [key]: mutation }), operation)
  return update(state, mutation)
}

export default class Store {
  constructor(state = {}) {
    this._state = state
  }

  get state() {
    return createMutator(this, Path.root)
  }

  get(path) {
    try {
      return path.walk(this._state)
    } catch(e) {
      throw `404: Path ${path} is not valid`
    }
  }

  put(path, value) {
    this._state = applyMutation(this._state, path, actions.set(value))
  }

  patch(path, value) {
    this._state = applyMutation(this._state, path, actions.merge(value))
  }

  map(path, fn) {
    this._state = applyMutation(this._state, path, actions.map(fn))
  }

  delete(path, index) {
    this._state = applyMutation(this._state, path, actions.delete(index))
  }
}
