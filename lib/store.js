import update from "immutability-helper"
import createResource from "./resource"

const actions = {
  map: (fn) => ({ $apply: fn }),
  push: (data) => ({ $push: [data] }),
  merge: (data) => ({ $merge: data }),
  set: (data) => ({ $set: data }),
  delete: (index) => ({ $splice: [[index, 1]] }),
}

export default function createStore(state = {}) {
  let listeners = []

  return {
    subscribe(listener) {
      listeners.push(listener)
      return () => {
        listeners = listeners.filter(l => l !== listener)
      }
    },

    resources: createResource({
      applyMutation(path, operation) {
        const reversedPathParts = path.reverse()
        const mutation = reversedPathParts.reduce((mutation, key) => ({ [key]: mutation }), operation)

        state = update(state, mutation)

        listeners.forEach(listener => listener(state))
      },

      get(path) {
        return path.reduce((subtree, nextKey) => subtree[nextKey], state) || state
      },

      map(path, fn) {
        this.applyMutation(path, actions.map(fn))
      },

      post(path, data) {
        this.applyMutation(path, actions.push(data))
      },

      put(path, data) {
        this.applyMutation(path, actions.set(data))
      },

      patch(path, data) {
        this.applyMutation(path, actions.merge(data))
      },

      delete(path) {
        this.applyMutation(path, actions.delete(path.pop()))
      },
    }),
  }
}
