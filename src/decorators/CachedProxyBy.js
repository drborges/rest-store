export const CachedProxyBy = (keyResolver) => (Target) => {
  const cache: { [string]: any } = {}

  return class {
    constructor() {
      const key = keyResolver(...arguments)

      if (cache[key]) {
        return cache[key]
      }

      cache[key] = new Proxy({}, new Target(...arguments))
      return cache[key]
    }
  }
}
