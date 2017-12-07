import Path from "./Path"
import ReStore from "./ReStore"
import NodeHandler from "./NodeHandler"
import ArrayNodeHandler from "./ArrayNodeHandler"
import ObjectNodeHandler from "./ObjectNodeHandler"

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
      new ArrayNodeHandler(this, path, $parent, $children) :
      new ObjectNodeHandler(this, path, $parent, $children)

    return new Proxy(obj, handler)
  }
}
