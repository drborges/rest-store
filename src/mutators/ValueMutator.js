import Path from "../Path"
import Mutator from "./Mutator"
import { Proxyable } from "../decorators"

// TODO:
// 1. Follow up on https://github.com/babel/babel/pull/5020
// That PR would allow "export default" + decorators
@Proxyable
export class ValueMutator extends Mutator {
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
