import Path from "../Path"
import createMutator from "./factory"
import Mutator from "./Mutator"
import { CachedProxyBy } from "../decorators"

// TODO:
// 1. Follow up on https://github.com/babel/babel/pull/5020
// That PR would allow "export default" + decorators
@CachedProxyBy((store, path) => path.toString())
export class ObjectMutator extends Mutator {
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

    return createMutator(this.store, this.path.child(prop))
  }

  set(target, prop, value, receiver) {
    this.store.put(this.path.child(prop), value)
    return true
  }
}
