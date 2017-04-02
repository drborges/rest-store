import { ValueMutator } from "./ValueMutator"
import { ObjectMutator } from "./ObjectMutator"

export default function createMutator(store, path): Mutator {
  const currentValue = path.walk(store.state)

  if (currentValue instanceof Array) {
    return new ObjectMutator(store, path)
  }

  if (currentValue instanceof Object) {
    return new ObjectMutator(store, path)
  }

  return new ValueMutator(store, path)
}
