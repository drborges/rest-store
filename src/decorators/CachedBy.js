export const CachedBy = (resolver) => (Target) => {
  const cache: { [string]: any } = {}

  return class {
    constructor() {
      const key = resolver(...arguments)

      if (cache[key]) {
        return cache[key]
      }

      cache[key] = new Target(...arguments)
      return cache[key]
    }
  }
}
