import { createMutator } from "./Factory"

export default class Mutator {
  constructor(store: Store, path: Path, chainable = true) {
    this.store = store
    this.path = path
    this.chainable = chainable
  }

  get(target, prop, receiver) {
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

  set(target, prop, value, receiver) {
    this.store.put(this.path.child(prop), value)
    return true
  }

  getter() {
    return this.store.get(this.path)
  }

  setter(value) {
    this.store.put(this.path, value)
  }

  toString() {
    `${this.get()}`
  }
}
