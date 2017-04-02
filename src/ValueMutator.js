import Path from "./Path"
import Mutator from "./Mutator"
import { CachedProxyBy } from "./decorators"

@CachedProxyBy((store, path) => path.toString())
export default class ValueMutator extends Mutator {
  constructor(store: Store, path: Path) {
    super(store, path)
  }

  get(target, prop, receiver) {
    if (prop === "set") {
      return (value) => this.store.put(this.path, value)
    }

    if (prop === "get") {
      return () => this.store.get(this.path)
    }

    return false
  }
}
