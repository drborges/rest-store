import Path from "../Path"
import Mutator from "./Mutator"
import { ProxiedAs } from "../decorators"

@ProxiedAs(Object)
export class ValueMutator extends Mutator {
  constructor(store: Store, path: Path) {
    super(store, path, false)
  }
}
