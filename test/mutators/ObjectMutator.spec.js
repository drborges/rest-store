import { expect } from "chai"
import deepFreeze from "deep-freeze"

import Path from "../../src/Path"
import Store from "../../src/Store"
import { ObjectMutator } from "../../src/mutators"

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
      const userMutator = new ObjectMutator(store, path)

      userMutator.name = "Borges"

      expect(store.get(path)).to.deep.equal({
        name: "Borges",
        comments: [],
      })
    })

    it("triggers a store mutation deep in the path", () => {
      const path = new Path("users", 1)
      const userMutator = new ObjectMutator(store, path)

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
      const userMutator = new ObjectMutator(store, path)

      const user = userMutator.get()

      expect(user).to.deep.equal(store.get(path))
    })
  })

  describe("#merge", () => {
    it("triggers a store mutation for a child path by merging extra data", () => {
      const path = new Path("users", 0)
      const userMutator = new ObjectMutator(store, path)

      userMutator.merge({ age: 31 })

      expect(store.get(path)).to.deep.equal({
        name: "Diego",
        age: 31,
        comments: [],
      })
    })
  })

  describe("@@iterator", () => {
    it("supports for .. of loop", () => {
      const path = new Path("users", 0)
      const mutator = new ObjectMutator(store, path)

      for (let [prop, value] of mutator) {
        const storeVal = store.get(path.child(prop))
        const propVal = mutator[prop].get()

        expect(propVal).to.deep.equal(storeVal)
        expect(propVal).to.deep.equal(value.get())
      }
    })

    it("supports destructuring", () => {
      const mutator = new ObjectMutator(store, new Path("users", 0))
      const { name, comments } = mutator

      expect(name.get()).to.equal("Diego")
      expect(comments.get()).to.be.empty
    })

    it("supports spread operator", () => {
      const mutator = new ObjectMutator(store, new Path("users", 0))
      const keyValues = [...mutator]

      expect(keyValues[0][0]).to.equal("name")
      expect(keyValues[0][1].get()).to.equal("Diego")
      expect(keyValues[1][0]).to.equal("comments")
      expect(keyValues[1][1].get()).to.deep.equal([])
    })
  })
})
