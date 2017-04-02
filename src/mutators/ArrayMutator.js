import Path from "../Path"
import createMutator from "./factory"
import Mutator from "./Mutator"
import { Proxyable } from "../decorators"

// TODO:
// 1. Follow up on https://github.com/babel/babel/pull/5020
// That PR would allow "export default" + decorators
@Proxyable
export class ArrayMutator extends Mutator {
  constructor(store: Store, path: Path, view = store.get(path).map((_, i) => i)) {
    super(store, path)
    this.view = view
  }

  get(target, prop, receiver) {
    if (prop.toString() === "set") {
      return (value) => this.store.put(this.path, value)
    }

    if (prop.toString() === "get") {
      return () => this.store.get(this.path)
    }

    if (prop.toString() === "push") {
      return (data) => this.store.map(this.path, array => [
        ...array,
        data,
      ])
    }

    if (prop.toString() === "view") {
      return this.view
    }

    if (prop.toString() === "path") {
      return this.path
    }

    if (prop.toString() === "store") {
      return this.store
    }

    if (prop.toString() === Symbol.iterator.toString()) {
      return this[prop]
    }

    return createMutator(this.store, this.path.child(prop))
  }

  set(target, prop, value, receiver) {
    this.store.put(this.path.child(prop), value)
    return true
  }

  *[Symbol.iterator]() {
    for (let index of this.view) {
      yield createMutator(this.store, this.path.child(index))
    }
  }
}
