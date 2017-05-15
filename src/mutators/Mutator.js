// @flow

import type RestStore from "../RestStore"
import type Path from "../Path"

import { createMutator } from "./createMutator"

export default class Mutator<T: Object> {
  path: Path
  store: RestStore<T>

  constructor(store: RestStore<T>, path: Path) {
    this.store = store
    this.path = path
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

  set(target: Object, prop: string, value: any, receiver: Object) {
    this.store.put(this.path.child(prop), value)
    return true
  }

  get $get(): T {
    return this.store.get(this.path)
  }

  get [Symbol.toStringTag]() {
   return `${this.constructor.name}(${this.path})`;
 }
}
