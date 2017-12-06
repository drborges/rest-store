import NodeHandler from "./NodeHandler";

/**
 * Represents a Node in the StateTree of type Array
 *
 * This Proxy handler provides an API equivalent to the Array's,
 * however, mutations are only applied to the StateTree in an
 * immutable fashion, and the proxied data is never touched.
 */
export default class ArrayNodeHandler extends NodeHandler {
  constructor(stateTree: StateTree, path: Path, parent: NodeHandler, $children: Object) {
    super(stateTree, path, parent, $children);
  }

  push = (items) => (item) => {
    this.stateTree.store.set(this.path, [
      ...items,
      item,
    ]);

    this.refresh(this.path.child(items.length));
  };

  pop = (items) => () => {
    const lastItemIndex = items.length - 1;
    const lastItem = items[lastItemIndex];
    this.stateTree.store.delete(this.path, lastItemIndex);
    this.refresh(this.path.child(lastItemIndex));
    return lastItem;
  };

  splice = (items) => (start, removeCount, ...newItems) => {
    const spliced = [...items];
    const removed = spliced.splice(start, removeCount, ...newItems);

    this.stateTree.store.set(this.path, spliced);
;
    this.refresh(this.path.child(start));
    return removed;
  };
}
