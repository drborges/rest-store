import Path from "../Path"
import Mutator from "./Mutator"
import Factory from "./Factory"

export class ObjectMutator extends Mutator {
  constructor(store: Store, path: Path) {
    super(store, path)
  }

  merge(data) {
    this.store.patch(this.path, data)
  }

  *[Symbol.iterator]() {
    const value = this.store.get(this.path)
    for (let prop in value) {
      const mutator = Factory.createMutator(this.store, this.path.child(prop))
      yield [prop, mutator]
    }
  }
}
