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
    const propName = prop.toString()

    if (this[prop]) {
      return this[prop]
    }

    return createMutator(this.store, this.path.child(prop))
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
