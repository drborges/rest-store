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
})
