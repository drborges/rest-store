// @flow

import type RestStore from "../RestStore"
import type Path from "../Path"

import { createMutator } from "./Factory"

export default class Mutator<T: Object> {
  path: Path
  store: RestStore<T>
  chainable: boolean

  constructor(store: RestStore<T>, path: Path, chainable: boolean = true) {
    this.store = store
    this.path = path
    this.chainable = chainable
  }

  get(target: Object, prop: string, receiver: Object) {
    const propName = prop.toString()
    if (propName === "set") {
      return this.setter
    }

    if (propName === "get") {
      return this.getter
    }

    if (this[prop]) {
      return this[prop]
    }

    if (!this.chainable) {
      return true
    }

    return createMutator(this.store, this.path.child(prop))
  }

  set(target: Object, prop: string, value: any, receiver: Object) {
    this.store.put(this.path.child(prop), value)
    return true
  }

  getter() {
    return this.store.get(this.path)
  }

  setter(value: T) {
    this.store.put(this.path, value)
  }

  get [Symbol.toStringTag]() {
   return `${this.constructor.name}(${this.path})`;
 }
}
