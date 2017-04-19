// @flow

import type RestStore from "../RestStore"

import Path from "../Path"
import Mutator from "./Mutator"
import { ProxiedAs } from "../decorators"

@ProxiedAs(Object)
export class ValueMutator<T: Object> extends Mutator<T> {
  constructor(store: RestStore<T>, path: Path) {
    super(store, path, false)
  }
}
