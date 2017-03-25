export class Router {
  static resolve(path, values = []) {
    const parts = path.slice(1).split("/")
    const isParam = (part) => part[0] === ":"
    return parts.map(part => isParam(part) ? values.shift() : part)
  }

  static fetch(state, pathKeys = []) {
    return pathKeys.reduce((subtree, key) => subtree && subtree[key], state)
  }
}

export default {
  Router,
}
