import update from "immutability-helper"
import { createResource, destructPath } from "./resource"

const actions = {
  map: (fn) => ({ $apply: fn }),
  push: (data) => ({ $push: [data] }),
  merge: (data) => ({ $merge: data }),
  set: (data) => ({ $set: data }),
  delete: (index) => ({ $splice: [[index, 1]] }),
}

export default class Store {
  constructor(initialState = {}) {
    this.state = initialState
    this.listeners = []
  }

  resources = () => createResource(this)

  applyMutation(pathParts, operation) {
    const reversedPathParts = pathParts.reverse()
    const mutation = reversedPathParts.reduce((mutation, key) => ({ [key]: mutation }), operation)

    this.state = update(this.state, mutation)
    this.listeners.forEach(listener => listener(this.state))
  }

  get(path) {
    return destructPath(path).reduce((subtree, nextKey) => subtree[nextKey], this.state)
  }

  map(path, fn) {
    this.applyMutation(destructPath(path), actions.map(fn))
  }

  post(path, data) {
    this.applyMutation(destructPath(path), actions.push(data))
  }

  put(path, data) {
    this.applyMutation(destructPath(path), actions.set(data))
  }

  patch(path, data) {
    this.applyMutation(destructPath(path), actions.merge(data))
  }

  delete(path) {
    const keys = destructPath(path)
    this.applyMutation(keys, actions.delete(keys.pop()))
  }

  subscribe(listener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }
}
