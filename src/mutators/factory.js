import { ValueMutator } from "./ValueMutator"
import { ArrayMutator } from "./ArrayMutator"
import { ObjectMutator } from "./ObjectMutator"

// There is some improvement room over here. It would be interesting if a user
// could create their own data types, and custom data mutator with a domain
// specific API.
const factory = {
  [Array]: createArrayMutator,
  [Object]: createObjectMutator,
  [String]: createValueMutator,
  [Number]: createValueMutator,
  [Boolean]: createValueMutator,
  [undefined]: createValueMutator,
}

export function createMutator(store, path): Mutator {
  const currentValue = path.walk(store.state)
  const create = factory[currentValue && currentValue.constructor]
  return create && create(store, path) || createObjectMutator(store, path)
}

export function createArrayMutator(store, path, view) {
  return new Proxy([], new ArrayMutator(store, path, view))
}

export function createValueMutator(store, path) {
  return new Proxy({}, new ValueMutator(store, path))
}

export function createObjectMutator(store, path) {
  return new Proxy({}, new ObjectMutator(store, path))
}

export default {
  createMutator,
  createArrayMutator,
  createValueMutator,
  createObjectMutator,
}
