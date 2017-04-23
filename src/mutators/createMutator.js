// @flow

import type RestStore from "../RestStore"

import Path from "../Path"

import { ArrayMutator } from "./ArrayMutator"
import { ObjectMutator } from "./ObjectMutator"

export function createMutator<T: Object>(store: RestStore<T>, path: Path, view: ?number[]): Proxy<T> & T {
  const state = store.get(Path.root)
  const currentValue = path.walk(state)
  const Mutator = Array.isArray(currentValue) ? ArrayMutator : ObjectMutator
  return new Mutator(store, path, view)
}
