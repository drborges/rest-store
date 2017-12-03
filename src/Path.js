// @flow

import type { PathNode } from "./types"

import { CachedBy } from "./decorators"

@CachedBy((...nodes: PathNode[]) => nodes.toString())
export default class Path {
  static root = new Path

  static parse = (str: String): Path => {
    const nodes = str.split("/").slice(1)
    return new Path(...nodes)
  }

  nodes: PathNode[]

  constructor(...nodes: PathNode[]) {
    this.nodes = nodes
  }

  child(node: PathNode): Path {
    return new Path(...[...this.nodes, node])
  }

  parent(): Path {
    return new Path(...this.nodes.slice(0, this.nodes.length-1))
  }

  match(path: Path): boolean {
    const pattern = new RegExp(`^${path.toString()}$`)
    return pattern.test(this.toString())
  }

  isAncestorOf(path: Path): boolean {
    return path.match(this.child(".*"));
  }

  walk(obj: Object|any[]): any {
    return this.nodes.reduce((data, node) => data[node], obj)
  }

  toString(): string {
    return `/${this.nodes.join("/")}`
  }

  *[Symbol.iterator](): Iterable<PathNode> {
    for (const node of this.nodes) {
      yield node
    }
  }
}
