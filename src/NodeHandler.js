/**
 * Represents a Node in the StateTree
 */
export default class NodeHandler {
  static proxiables = {
    Object: true,
    Array: true,
  };

  constructor(stateTree: StateTree, path: Path, parent: NodeHandler = null, $children = {}) {
    this.stateTree = stateTree;
    this.path = path;
    this.parent = parent;
    this.$children = $children;
  }

  /**
   * Checks whether or not a given value is proxiable
   *
   * Currently only plain objects or arrays can be proxied.
   */
  isProxy(value) {
    return value && Object
      .keys(NodeHandler.proxiables)
      .includes(value.constructor.name);
  }

  /**
   * Constructs a StateTree path through Proxied objects which keeps
   * track of the current location on the StateTree.
   *
   * This technique allows interactions with the StateTree via conventional
   * Object dot notation operations.
   */
  get(target, prop) {
    if (prop === "$children") {
      return this.$children;
    }

    const value = target[prop];

    if (typeof value === "function") {
      return this[prop] && this[prop](target) || value.bind(target);
    }

    if (!this.isProxy(value)) {
      return value;
    }

    const childPath = this.path.child(prop);

    if (!this.$children[childPath]) {
      this.$children[childPath] = this.stateTree.create(childPath, this);
    }

    return this.$children[childPath];
  }

  /**
   * Triggers a mutation for a given Path onto the immutable StateTree.
   * A new StateTree representing the mutation is created as a result.
   */
  set(target, prop, value) {
    if (prop === "$children") {
      return true;
    }

    const childPath = this.path.child(prop);

    this.stateTree.store.set(childPath, value);
    this.refresh(childPath);

    return true;
  }

  /**
   * Traverses a Tree path refreshing dirty nodes with new instances
   * leaving alone nodes that were not affected by the given mutation.
   */
  refresh(childPath: Path) {
    const $child = this.$children[childPath];
    delete this.$children[childPath];

    if (this.parent) {
      this.parent.refresh(this.path);
    }

    if ($child) {
      this.$children[childPath] = this.stateTree.create(childPath, this, $child.$children);
    }
  }
}
