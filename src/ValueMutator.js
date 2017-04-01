import Path from "./Path"
import Mutator from "./Mutator"

function CachedProxy(Target: Class<Mutator>): Proxy {
  const cache: { [string]: Mutator } = {}

  return class {
    constructor(store: Store, path: Path) {
      const key = path.toString()
      if (cache[key]) return cache[key]
      cache[key] = new Proxy({}, new Target(store, path))
      return cache[key]
    }
  }
}

@CachedProxy
export default class ValueMutator extends Mutator {
  constructor(store: Store, path: Path) {
    super(store, path)
  }

  get(target, prop, receiver) {
    if (prop === "set") {
      return (value) => this.store.put(this.path, value)
    }

    if (prop === "get") {
      return () => this.store.get(this.path)
    }

    return false
  }
}
