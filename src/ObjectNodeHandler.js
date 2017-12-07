import NodeHandler from "./NodeHandler"

/**
 * Represents a Node in the StateTree of type Object
 */
export default class ObjectNodeHandler extends NodeHandler {
  constructor(stateTree: StateTree, path: Path, parent: NodeHandler, $children: Object) {
    super(stateTree, path, parent, $children)
  }
}
