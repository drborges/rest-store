import { expect } from "chai"
import deepFreeze from "deep-freeze"

import Path from "../../src/Path"
import Store from "../../src/Store"
import Factory from "../../src/mutators/Factory"

describe("ArrayMutator", () => {
  let store

  beforeEach(() => {
    store = new Store(deepFreeze({
      users: [
        { name: "Diego", comments: [] },
        { name: "Bianca", comments: [{ text: "Nice!" }] },
      ]
    }))
  })

  describe("instanceof", () => {
    it("is an instance of Array", () => {
      const mutator = Factory.createArrayMutator(store, new Path("users"))
      expect(mutator).to.be.an.instanceof(Array)
    })
  })

  describe("#push", () => {
    it("triggers a store mutation by pushing a new item to an array", () => {
      const path = new Path("users")
      const mutator = Factory.createArrayMutator(store, path)

      mutator.push({ name: "Hernando", comments: [] })

      expect(store.state).to.deep.equal({
        users: [
          { name: "Diego", comments: [] },
          { name: "Bianca", comments: [{ text: "Nice!" }] },
          { name: "Hernando", comments: [] },
        ]
      })
    })

    it("triggers a store mutation by pushing a new item to an array deep in the state tree", () => {
      const path = new Path("users")
      const usersMutator = Factory.createArrayMutator(store, path)

      usersMutator[0].comments.push({ text: "New comment" })

      expect(store.state).to.deep.equal({
        users: [
          { name: "Diego", comments: [{ text: "New comment" }] },
          { name: "Bianca", comments: [{ text: "Nice!" }] },
        ]
      })
    })
  })

  describe("@@iterator", () => {
    it("allows using mutator within a for .. of loop", () => {
      const path = new Path("users")
      const usersMutator = Factory.createArrayMutator(store, path)

      for (let user of usersMutator) {
        user.active = true
      }

      expect(store.state).to.deep.equal({
        users: [
          { name: "Diego", active: true, comments: [] },
          { name: "Bianca", active: true, comments: [{ text: "Nice!" }] },
        ]
      })
    })

    it("supports spread operator", () => {
      const path = new Path("users")
      const usersMutator = Factory.createArrayMutator(store, path)
      const [head, ...tail] = usersMutator

      expect(head.get()).to.deep.equal({
        name: "Diego", comments: [],
      })

      expect(tail.get()).to.deep.equal([
        { name: "Bianca", comments: [{ text: "Nice!" }] },
      ])
    })
  })

  describe("#get", () => {
    it("fetches underlying value from store", () => {
      const path = new Path("users")
      const mutator = Factory.createArrayMutator(store, path)

      const users = mutator.get()

      expect(users).to.deep.equal(store.get(path))
    })
  })
})
