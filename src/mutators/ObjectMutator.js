import Path from "../Path"
import Mutator from "./Mutator"

export class ObjectMutator extends Mutator {
  constructor(store: Store, path: Path) {
    super(store, path)
  }
}
