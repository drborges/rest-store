export const Proxyable = (Target) => class {
  constructor() {
    return new Proxy({}, new Target(...arguments))
  }
}
