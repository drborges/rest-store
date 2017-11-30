// @flow

import Path from "./Path"
import RestStore from "./RestStore"
import { createMutator } from "./mutators"

import type { Listener } from "./types"

export default class Store<T: Object> {
  rest: RestStore<T>

  constructor(initialState: T) {
    this.rest = new RestStore(initialState)
  }

  get state(): T {
    return createMutator(this.rest, Path.root)
  }

  subscribe(listener: Listener<T>) {
    this.rest.subscribe(listener)
  }
}
