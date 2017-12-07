import Node from "./Node"

import type { TreeNode, Children } from "./types"

/**
 * Represents a Node in the StateTree of type Object
 */
export default class ObjectNode extends Node {
  constructor(stateTree: StateTree, path: Path, $parent: TreeNode, $children: Children) {
    super(stateTree, path, $parent, $children)
  }
}
