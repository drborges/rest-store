const targetFor = (type) => type === Array ? [] : {}

export const ProxiedAs = (type) => (Target) => class {
  constructor() {
    return new Proxy(targetFor(type), new Target(...arguments))
  }
}
