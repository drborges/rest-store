// @flow

import type RestStore from "../RestStore"

import Path from "../Path"

import { ValueMutator } from "./ValueMutator"
import { ArrayMutator } from "./ArrayMutator"
import { ObjectMutator } from "./ObjectMutator"

const factory = {
  [Array.toString()]: ArrayMutator,
  [Object.toString()]: ObjectMutator,
  [String.toString()]: ValueMutator,
  [Number.toString()]: ValueMutator,
  [Boolean.toString()]: ValueMutator,
}

export function createMutator<T: Object>(store: RestStore<T>, path: Path, view: ?number[]): Proxy<T> & T {
  const state = store.get(Path.root)
  const currentValue = path.walk(state)
  const Mutator = factory[currentValue && currentValue.constructor]
  return new Mutator(store, path, view)
}
