// @flow

import type RestStore from "../RestStore"

import Path from "../Path"
import Mutator from "./Mutator"
import { createMutator } from "./createMutator"
import { ProxiedAs } from "../decorators"

@ProxiedAs(Object)
export class ObjectMutator<T: Object> extends Mutator<T> {
  constructor(store: RestStore<T>, path: Path) {
    super(store, path)
  }

  merge(data: T) {
    this.store.patch(this.path, data)
  }

  *[Symbol.iterator](): Iterable<[string, Mutator<T>]> {
    const value = this.store.get(this.path)
    for (let prop in value) {
      const mutator = createMutator(this.store, this.path.child(prop))
      yield [prop, mutator]
    }
  }
}
