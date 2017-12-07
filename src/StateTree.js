import Path from "./Path"
import ReStore from "./ReStore"
import Node from "./Node"
import ArrayNode from "./ArrayNode"
import ObjectNode from "./ObjectNode"

import type { TreeNode, Children } from "./types"

export default class StateTree {
  constructor(store: ReStore = new ReStore) {
    this.store = store
  }

  create(path: string|Path = Path.root, $parent: TreeNode = null, $children: Children = {}) {
    if (path.constructor === String) {
      path = Path.parse(path)
    }

    const obj = this.store.get(path)
    const handler = Array.isArray(obj) ?
      new ArrayNode(this, path, $parent, $children) :
      new ObjectNode(this, path, $parent, $children)

    return new Proxy(obj, handler)
  }
}
