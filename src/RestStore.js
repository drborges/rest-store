// @flow

import type { StoreActions } from "./types"

import Path from "./Path"
import update from "immutability-helper"

const actions = {
  map: (fn) => ({ $apply: fn }),
  set: (data) => ({ $set: data }),
  merge: (data) => ({ $merge: data }),
  delete: (index) => ({ $splice: [[index, 1]] }),
}

const applyMutation = <T>(state: T, path: Path, operation: StoreActions) => {
  const reversedPathNodes = [...path].reverse()
  const mutation = reversedPathNodes.reduce((mutation, key) => ({ [key]: mutation }), operation)
  return update(state, mutation)
}

export default class RestStore<T: Object> {
  state: T

  constructor(initialState: T) {
    this.state = initialState
  }

  get(path: Path): any {
    try {
      return path.walk(this.state)
    } catch(e) {
      throw `404: Path ${path.toString()} is not valid`
    }
  }

  put(path: Path, value: any) {
    this.state = applyMutation(this.state, path, actions.set(value))
  }

  patch(path: Path, value: any) {
    this.state = applyMutation(this.state, path, actions.merge(value))
  }

  map(path: Path, fn: (any) => any) {
    this.state = applyMutation(this.state, path, actions.map(fn))
  }

  delete(path: any, index: number) {
    this.state = applyMutation(this.state, path, actions.delete(index))
  }
}
