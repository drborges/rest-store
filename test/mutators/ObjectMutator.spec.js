import { expect } from "chai"
import deepFreeze from "deep-freeze"

import Path from "../../src/Path"
import Store from "../../src/Store"
import { ObjectMutator } from "../../src/mutators"

describe("ObjectMutator", () => {
  const store = new Store(deepFreeze({
    users: [
      { name: "Diego", comments: [] },
      { name: "Bianca", comments: [{ text: "Nice!" }] },
    ]
  }))

  describe("#set", () => {
    it("triggers a store mutation for a child path", () => {
      const path = new Path("users", 0)
      const userMutator = new ObjectMutator(store, path)

      userMutator.name = "Borges"

      expect(store.get(path)).to.deep.equal({
        name: "Borges",
        comments: [],
      })
    })

    it("triggers a store mutation deep in the path", () => {
      const path = new Path("users")
      const usersMutator = new ObjectMutator(store, path)

      usersMutator[1].comments[0].text = "Sweet!"

      expect(store.get(path.child(1).child("comments").child(0))).to.deep.equal({
        text: "Sweet!",
      })
    })
  })

  describe("#get", () => {
    it("fetches underlying value from store", () => {
      const path = new Path("users", 1)
      const userMutator = new ObjectMutator(store, path)

      const user = userMutator.get()

      expect(user).to.deep.equal(store.get(path))
    })
  })

  describe("cache", () => {
    it("caches value mutator to avoid memory leaks", () => {
      const mutator1 = new ObjectMutator({}, new Path("users", "0"))
      const mutator2 = new ObjectMutator({}, new Path("users", "0"))

      expect(mutator1).to.equal(mutator2)
    })
  })
})
