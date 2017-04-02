import { expect } from "chai"
import deepFreeze from "deep-freeze"

import Path from "../../src/Path"
import Store from "../../src/Store"
import Factory from "../../src/mutators/Factory"

describe("ObjectMutator", () => {
  let store

  beforeEach(() => {
    store = new Store(deepFreeze({
      users: [
        { name: "Diego", comments: [] },
        { name: "Bianca", comments: [{ text: "Nice!" }] },
      ]
    }))
  })

  describe("#set", () => {
    it("triggers a store mutation for a child path", () => {
      const path = new Path("users", 0)
      const userMutator = Factory.createObjectMutator(store, path)

      userMutator.name = "Borges"

      expect(store.get(path)).to.deep.equal({
        name: "Borges",
        comments: [],
      })
    })

    it("triggers a store mutation deep in the path", () => {
      const path = new Path("users", 1)
      const userMutator = Factory.createObjectMutator(store, path)

      userMutator.comments[0].text = "Sweet!"

      expect(store.state).to.deep.equal({
        users: [
          { name: "Diego", comments: [] },
          { name: "Bianca", comments: [{ text: "Sweet!" }] },
        ]
      })
    })
  })

  describe("#get", () => {
    it("fetches underlying value from store", () => {
      const path = new Path("users", 1)
      const userMutator = Factory.createObjectMutator(store, path)

      const user = userMutator.get()

      expect(user).to.deep.equal(store.get(path))
    })
  })

  describe("#merge", () => {
    it("triggers a store mutation for a child path by merging extra data", () => {
      const path = new Path("users", 0)
      const userMutator = Factory.createObjectMutator(store, path)

      userMutator.merge({ age: 31 })

      expect(store.get(path)).to.deep.equal({
        name: "Diego",
        age: 31,
        comments: [],
      })
    })
  })
})
