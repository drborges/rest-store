import Path from "./Path";
import ReStore from "./ReStore";
import NodeHandler from "./NodeHandler";
import ArrayNodeHandler from "./ArrayNodeHandler";
import ObjectNodeHandler from "./ObjectNodeHandler";

export default class StateTree {
  constructor(store: ReStore = new ReStore) {
    this.store = store;
  }

  create(path = Path.root, parent = null, $children = {}) {
    const obj = this.store.get(path);
    const handler = Array.isArray(obj) ?
      new ArrayNodeHandler(this, path, parent, $children) :
      new ObjectNodeHandler(this, path, parent, $children);

    return new Proxy(obj, handler);
  }
}
