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

  get(target: Object, prop: string, receiver: Object) {
    if (this[prop]) {
      return this[prop]
    }

    const nextPath = this.path.child(prop)
    const val = this.store.get(nextPath)

    if (typeof(val) !== "object") {
      return val
    }

    return createMutator(this.store, nextPath)
  }

  merge(data: T) {
    this.store.patch(this.path, data)
  }

  *[Symbol.iterator](): Iterable<[string, Mutator<T>]> {
    const value = this.store.get(this.path)

    for (let prop in value) {
      const val = value[prop]
      const needsMutator = typeof(val) === "object"
      const mutator = needsMutator ? createMutator(this.store, this.path.child(prop)) : val
      yield [prop, mutator]
    }
  }
}
