// @flow

import Path from "./Path"
import RestStore from "./RestStore"
import { createMutator } from "./mutators"

export default class Store<T: Object> {
  rest: RestStore<T>

  constructor(initialState: T) {
    this.rest = new RestStore(initialState)
  }

  get state(): T {
    return createMutator(this.rest, Path.root)
  }
}
