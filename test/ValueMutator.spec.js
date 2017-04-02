import { expect } from "chai"

import Path from "../src/Path"
import Store from "../src/Store"
import ValueMutator from "../src/ValueMutator"

describe("ValueMutator", () => {
  let store

  beforeEach(() => {
    store = new Store({
      users: [
        { name: "Diego", comments: [] },
        { name: "Bianca", comments: [{ text: "Nice!" }] },
      ]
    })
  })

  describe("#set", () => {
    it("triggers a mutation in the store", () => {
      const userNamePath = new Path("users", "0", "name")
      const nameMutator = new ValueMutator(store, userNamePath)

      nameMutator.set("Borges")

      expect(store.get(userNamePath)).to.equal("Borges")
    })
  })

  describe("#get", () => {
    it("fetches underlying value from store", () => {
      const userNamePath = new Path("users", "1", "name")
      const nameMutator = new ValueMutator(store, userNamePath)

      const name = nameMutator.get()

      expect(name).to.equal("Bianca")
    })
  })

  describe("cache", () => {
    it("caches value mutator to avoid memory leaks", () => {
      const mutator1 = new ValueMutator({}, new Path("users", "0", "name"))
      const mutator2 = new ValueMutator({}, new Path("users", "0", "name"))

      expect(mutator1).to.equal(mutator2)
    })
  })
})
