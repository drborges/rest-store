// @flow

function Cached(Target: Class<Path>) {
  const cache: { [string]: Path } = {}

  return class {
    constructor(...path: string[]) {
      const key = path.toString()
      if (cache[key]) return cache[key]
      cache[key] = new Target(...path)
      return cache[key]
    }
  }
}

@Cached
export default class Path {
  nodes: string[]

  constructor(...nodes: string[]) {
    this.nodes = nodes
  }

  child(node: string): Path {
    return new Path(...[...this.nodes, node])
  }

  parent(): Path {
    return new Path(...this.nodes.slice(0, this.nodes.length-1))
  }

  match(path: Path): boolean {
    const pattern = new RegExp(`^${path.toString()}$`)
    return pattern.test(this.toString())
  }

  walk(obj: any): any {
    return this.nodes.reduce((data, node) => data[node], obj)
  }

  reversedNodes(): string[] {
    return [...this.nodes].reverse()
  }

  toString(): string {
    return `/${this.nodes.join("/")}`
  }
}
