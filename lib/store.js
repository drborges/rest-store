import update from "immutability-helper"
import { createResource, pathParts } from "./resource"

const actions = {
  map: (fn) => ({ $apply: fn }),
  post: (data) => ({ $push: [data] }),
  patch: (data) => ({ $merge: data }),
  put: (data) => ({ $set: data }),
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
    return pathParts(path).reduce((subtree, nextKey) => subtree[nextKey], this.state)
  }

  map(path, fn) {
    this.applyMutation(pathParts(path), actions.map(fn))
  }

  post(path, data) {
    this.applyMutation(pathParts(path), actions.post(data))
  }

  put(path, data) {
    this.applyMutation(pathParts(path), actions.put(data))
  }

  patch(path, data) {
    this.applyMutation(pathParts(path), actions.patch(data))
  }

  delete(path) {
    const keys = pathParts(path)
    this.applyMutation(keys, actions.delete(keys.pop()))
  }

  subscribe(listener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }
}
