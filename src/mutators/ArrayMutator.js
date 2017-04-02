import Path from "../Path"
import Mutator from "./Mutator"
import Factory from "./Factory"

export class ArrayMutator extends Mutator {
  constructor(store: Store, path: Path, view = store.get(path).map((_, i) => i)) {
    super(store, path)
    this.view = view
  }

  push(data) {
    return this.store.map(this.path, array => [
      ...array,
      data,
    ])
  }

  *[Symbol.iterator]() {
    for (let index of this.view) {
      yield Factory.createMutator(this.store, this.path.child(index))
    }
  }
}
