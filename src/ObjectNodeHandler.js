import NodeHandler from "./NodeHandler"

import type { TreeNode, Children } from "./types"

/**
 * Represents a Node in the StateTree of type Object
 */
export default class ObjectNodeHandler extends NodeHandler {
  constructor(stateTree: StateTree, path: Path, $parent: TreeNode, $children: Children) {
    super(stateTree, path, $parent, $children)
  }
}
