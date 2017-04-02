import Path from "../Path"
import Mutator from "./Mutator"

export class ValueMutator extends Mutator {
  constructor(store: Store, path: Path) {
    super(store, path, false)
  }
}
