// @flow

import type { CacheKeyResolver } from "../types"

export const CachedBy = (resolver: CacheKeyResolver) => (Target: Class<any>) => {
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
