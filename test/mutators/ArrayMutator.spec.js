import { expect } from "chai"
import deepFreeze from "deep-freeze"

import Path from "../../src/Path"
import RestStore from "../../src/RestStore"
import { ArrayMutator } from "../../src/mutators"

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

describe("ArrayMutator", () => {
  let store: RestStore<MyState>

  beforeEach(() => {
    store = new RestStore(deepFreeze({
      users: [
        { name: "Diego", comments: [] },
        { name: "Bianca", comments: [{ text: "Nice!" }] },
      ]
    }))
  })

  describe("instanceof", () => {
    it("is an instance of Array", () => {
      const mutator = new ArrayMutator(store, new Path("users"))
      expect(mutator).to.be.an.instanceof(Array)
    })
  })

  describe("#push", () => {
    it("triggers a store mutation by pushing a new item to an array", () => {
      const path = new Path("users")
      const mutator = new ArrayMutator(store, path)

      mutator.push({ name: "Hernando", comments: [] })

      expect(store.get(new Path)).to.deep.equal({
        users: [
          { name: "Diego", comments: [] },
          { name: "Bianca", comments: [{ text: "Nice!" }] },
          { name: "Hernando", comments: [] },
        ]
      })
    })

    it("triggers a store mutation by pushing a new item to an array deep in the state tree", () => {
      const path = new Path("users")
      const usersMutator = new ArrayMutator(store, path)

      usersMutator[0].comments.push({ text: "New comment" })

      expect(store.get(new Path)).to.deep.equal({
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
      const usersMutator = new ArrayMutator(store, path)

      for (let user of usersMutator) {
        user.active = true
      }

      expect(store.get(new Path)).to.deep.equal({
        users: [
          { name: "Diego", active: true, comments: [] },
          { name: "Bianca", active: true, comments: [{ text: "Nice!" }] },
        ]
      })
    })

    it("supports spread operator", () => {
      const path = new Path("users")
      const usersMutator = new ArrayMutator(store, path)
      const [head, ...tail] = usersMutator

      expect(head.name).to.equal("Diego")
      expect(tail.$get).to.deep.equal([
        { name: "Bianca", comments: [{ text: "Nice!" }] },
      ])
    })

    it("supports array with primitive values", () => {
      const store = new RestStore(deepFreeze([0, 1, 2]))
      const mutator = new ArrayMutator(store, new Path)

      let i = 0
      for (let item of mutator) {
        expect(item).to.equal(i++)
      }
    })
  })

  describe("#map", () => {
    it("map array items", () => {
      const users = new ArrayMutator(store, new Path("users"))
      const names = users.map(user => user.name)
      expect(names).to.deep.equal(["Diego", "Bianca"])
    })
  })

  describe("Symbol.toStringTag", () => {
    it("overrides the toString behavior", () => {
      const mutator = new ArrayMutator(store, new Path("users", 0, "comments"))
      expect(mutator.toString()).to.equal("[object ArrayMutator(/users/0/comments)]")
    })
  })
})
