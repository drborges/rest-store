import update from "immutability-helper"
import createResource from "./resource"

const pathParams = /:.\w+/gi
const path2string = (path) => `/${path.join("/")}`
const notifySubscribers = (subscribers, path, data) => {
  const subscription = Object.entries(subscribers).
    find(subscription => new RegExp(subscription[0]).test(path))

  subscription && subscription[1](data)
}

const actions = {
  map: (fn) => ({ $apply: fn }),
  push: (data) => ({ $push: [data] }),
  merge: (data) => ({ $merge: data }),
  set: (data) => ({ $set: data }),
  delete: (index) => ({ $splice: [[index, 1]] }),
}

export default function createStore(state = {}) {
  let listeners = []
  let subscribers = {
    post: {},
    put: {},
    patch: {},
    delete: {},
  }

  const store = {
    subscribe(listener) {
      listeners.push(listener)
      return () => {
        listeners = listeners.filter(l => l !== listener)
      }
    },

    resources: createResource({
      applyMutation(path, operation) {
        const reversedPathParts = [...path].reverse()
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
        notifySubscribers(subscribers.post, path2string(path), data)
      },

      put(path, data) {
        this.applyMutation(path, actions.set(data))
        notifySubscribers(subscribers.put, path2string(path), data)
      },

      patch(path, data) {
        this.applyMutation(path, actions.merge(data))
        notifySubscribers(subscribers.patch, path2string(path), this.get(path))
      },

      delete(path) {
        const deleted = this.get(path)
        this.applyMutation(path, actions.delete(path.pop()))
        notifySubscribers(subscribers.delete, path2string(path), deleted)
      },
    }),
  }

  store.subscribe.post = function(path, subscriber) {
    subscribers.post[path] = subscriber
  }

  store.subscribe.put = function(path, subscriber) {
    subscribers.put[path] = subscriber
  }

  store.subscribe.patch = function(path, subscriber) {
    subscribers.patch[path] = subscriber
  }

  store.subscribe.delete = function(path, subscriber) {
    subscribers.delete[path] = subscriber
  }

  return store
}
