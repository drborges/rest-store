import { expect } from "chai"

import Path from "../../src/Path"
import RestStore from "../../src/RestStore"
import { ValueMutator } from "../../src/mutators"

type User = {
  name: string,
  comments: Comment[],
}

type Comment = {
  text: string,
}

type MyState = {|
  users: User[],
|}

describe("ValueMutator", () => {
  let store: RestStore<MyState>

  beforeEach(() => {
    store = new RestStore({
      users: [
        { name: "Diego", comments: [] },
        { name: "Bianca", comments: [{ text: "Nice!" }] },
      ]
    })
  })

  describe("#set", () => {
    it("triggers a mutation in the store", () => {
      const userNamePath = new Path("users", 0, "name")
      const nameMutator = new ValueMutator(store, userNamePath)

      nameMutator.set("Borges")

      expect(store.get(userNamePath)).to.equal("Borges")
    })
  })

  describe("#get", () => {
    it("fetches underlying value from store", () => {
      const userNamePath = new Path("users", 1, "name")
      const nameMutator = new ValueMutator(store, userNamePath)

      const name = nameMutator.$value

      expect(name).to.equal("Bianca")
    })
  })

  describe("Symbol.toStringTag", () => {
    it("overrides the toString behavior", () => {
      const mutator = new ValueMutator(store, new Path("users", 0, "name"))
      expect(mutator.toString()).to.equal("[object ValueMutator(/users/0/name)]")
    })
  })
})
