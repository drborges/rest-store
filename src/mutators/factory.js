import { ValueMutator } from "./ValueMutator"
import { ArrayMutator } from "./ArrayMutator"
import { ObjectMutator } from "./ObjectMutator"

// There is some improvement room over here. It would be interesting if a user
// could create their own data types, and custom data mutator with a domain
// specific API.
const factory = {
  [Array]: ArrayMutator,
  [Object]: ObjectMutator,
  [String]: ValueMutator,
  [Number]: ValueMutator,
  [Boolean]: ValueMutator,
  // TODO: implement an UndefinedMutator to handle errors.
  [undefined]: ValueMutator,
}

export function createMutator(store, path, view): Mutator {
  const currentValue = path.walk(store.state)
  const Mutator = factory[currentValue && currentValue.constructor]
  return new Mutator(store, path, view)
}
