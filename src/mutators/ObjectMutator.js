import Path from "../Path"
import Mutator from "./Mutator"
import { createMutator } from "./Factory"
import { ProxiedAs } from "../decorators"

@ProxiedAs(Object)
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
      const mutator = createMutator(this.store, this.path.child(prop))
      yield [prop, mutator]
    }
  }
}
