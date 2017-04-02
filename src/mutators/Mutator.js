import Factory from "./Factory"

export default class Mutator {
  constructor(store: Store, path: Path, chainable = true) {
    this.store = store
    this.path = path
    this.chainable = chainable
  }

  get(target, prop, receiver) {
    if (prop.toString() === "set") {
      return (value) => this.store.put(this.path, value)
    }

    if (prop.toString() === "get") {
      return () => this.store.get(this.path)
    }

    if (this[prop]) {
      return this[prop]
    }

    if (!this.chainable) {
      return true
    }

    return Factory.createMutator(this.store, this.path.child(prop))
  }

  set(target, prop, value, receiver) {
    this.store.put(this.path.child(prop), value)
    return true
  }
}
