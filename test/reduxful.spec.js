import { expect } from "chai"
import { Router } from "../lib/reduxful"

describe("Router", () => {
  describe("#resolve", () => {
    it("resolves /users", () => {
      expect(Router.resolve("/users")).to.deep.equal(["users"])
    })

    it("resolves /users/:index", () => {
      expect(Router.resolve("/users/:index", [0])).to.deep.equal(["users", 0])
      expect(Router.resolve("/users/:index", [1])).to.deep.equal(["users", 1])
    })

    it("resolves /users/:index/comments/:index", () => {
      expect(Router.resolve("/users/:index/comments/:index", [0, 1])).to.deep.equal(["users", 0, "comments", 1])
    })
  })

  describe("#fetch", () => {
    const state = {
      users: [
        { name: "diego" },
        { name: "bibi", comments: [{ text: "LoL" }] }
      ]
    }

    it("fetches subtree for path /users", () => {
      const expectedSubtree = state.users
      const actualSubtree = Router.fetch(state, Router.resolve("/users"))

      expect(actualSubtree).to.deep.equal(expectedSubtree)
    })

    it("fetches subtree for path /users/1", () => {
      const expectedSubtree = state.users[1]
      const actualSubtree = Router.fetch(state, Router.resolve("/users/:index", [1]))

      expect(actualSubtree).to.deep.equal(expectedSubtree)
    })

    it("returns undefined when subtree does not exist", () => {
      const expectedSubtree = undefined
      const actualSubtree = Router.fetch(state, Router.resolve("/users/:index/comments/:index", [0, 0]))

      expect(actualSubtree).to.be.undefined
    })

    it("fetches subtree for path /users/1/comments/0", () => {
      const expectedSubtree = state.users[1].comments[0]
      const actualSubtree = Router.fetch(state, Router.resolve("/users/:index/comments/:index", [1, 0]))

      expect(actualSubtree).to.deep.equal(expectedSubtree)
    })
  })
})
