import { ValueMutator } from "./ValueMutator"
import { ArrayMutator } from "./ArrayMutator"
import { ObjectMutator } from "./ObjectMutator"

const defaultConfig = {
  chainable: true,
}

const proxyHandler = (store, path, config = defaultConfig) => ({
  get(target, prop, receiver) {
    if (prop.toString() === "set") {
      return (value) => store.put(path, value)
    }

    if (prop.toString() === "get") {
      return () => store.get(path)
    }

    if (target[prop]) {
      return target[prop]
    }

    if (!config.chainable) {
      return false
    }

    return createMutator(store, path.child(prop))
  },

  set(target, prop, value, receiver) {
    store.put(path.child(prop), value)
    return true
  }
})

export function createMutator(store, path): Mutator {
  const currentValue = path.walk(store.state)

  if (currentValue instanceof Array) {
    return createArrayMutator(store, path)
  }

  if (currentValue instanceof Object) {
    return createObjectMutator(store, path)
  }

  return createValueMutator(store, path)
}

export const createArrayMutator = (store, path) => {
  return new Proxy(new ArrayMutator(store, path), proxyHandler(store, path))
}

export const createValueMutator = (store, path) => {
  return new Proxy(new ValueMutator(store, path), proxyHandler(store, path, {
    chainable: false,
  }))
}

export const createObjectMutator = (store, path) => {
  return new Proxy(new ObjectMutator(store, path), proxyHandler(store, path))
}

export default {
  createMutator,
  createArrayMutator,
  createValueMutator,
  createObjectMutator,
}
