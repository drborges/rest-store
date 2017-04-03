import Path from "../Path"
import Mutator from "./Mutator"
import { createMutator } from "./Factory"
import { ProxiedAs } from "../decorators"

@ProxiedAs(Array)
export class ArrayMutator extends Mutator {
  constructor(store: Store, path: Path, view = store.get(path).map((_, i) => i)) {
    super(store, path)
    this.view = view
    this.length = this.view.length
  }

  push(data) {
    return this.store.map(this.path, array => [
      ...array,
      data,
    ])
  }

  slice(begin, end) {
    const view = this.view.slice(begin, end)
    return createMutator(this.store, this.path, view)
  }

  getter() {
    return this.store.get(this.path).filter((_, i) => this.view.includes(i))
  }

  *[Symbol.iterator]() {
    for (let index of this.view) {
      yield createMutator(this.store, this.path.child(index))
    }
  }
}
