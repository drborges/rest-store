// @flow

import type RestStore from "../RestStore"

import Path from "../Path"
import Mutator from "./Mutator"

import { createMutator } from "./createMutator"
import { ProxiedAs } from "../decorators"

@ProxiedAs(Array)
export class ArrayMutator<T: Object> extends Mutator<T> {
  view: number[]
  length: number

  constructor(store: RestStore<T>, path: Path, view: number[] = store.get(path).map((_, i) => i)) {
    super(store, path)
    this.view = view
    this.length = this.view.length
  }

  push(data: T) {
    return this.store.map(this.path, (array: T[]) => [
      ...array,
      data,
    ])
  }

  slice(begin: number, end: number): ArrayMutator<T> {
    const view = this.view.slice(begin, end)
    return createMutator(this.store, this.path, view)
  }

  get $get(): T[] {
    return this.store.get(this.path).filter((_, i) => this.view.includes(i))
  }

  *[Symbol.iterator](): Iterator<Mutator<T>> {
    for (let index of this.view) {
      const val = this.store.get(this.path.child(index))
      if (typeof(val) !== "object") {
        yield val
      } else {
        yield createMutator(this.store, this.path.child(index))
      }
    }
  }
}
