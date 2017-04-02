import { expect } from "chai"
import Path from "../src/Path"

describe("Path", () => {
  describe("#toString", () => {
    it("overrides #toString() with a more readable output", () => {
      const path = new Path("users", "0", "comments")

      expect(path.toString()).to.equal("/users/0/comments")
    })
  })

  describe("#child", () => {
    it("creates a child path", () => {
      const path = new Path("users", "0")
      const child = path.child("comments")

      expect(child.toString()).to.equal("/users/0/comments")
    })
  })

  describe("#parent", () => {
    it("creates a parent path", () => {
      const path = new Path("users", "0", "comments")
      const parent = path.parent()

      expect(parent.toString()).to.equal("/users/0")
    })
  })

  describe("cache", () => {
    it("caches path instances to avoid memory leaks", () => {
      const path1 = new Path("users", "0", "comments")
      const path2 = new Path("users", "0", "comments")

      expect(path1).to.equal(path2)
    })

    it("different paths are different objects", () => {
      const path1 = new Path("users", "0", "comments")
      const path2 = new Path("users", "1", "comments")

      expect(path1).to.not.equal(path2)
    })
  })

  describe("#match", () => {
    it("matches a given path", () => {
      const path1 = new Path("users", "0", "comments")
      const path2 = new Path("users", ".", "comments")

      expect(path1.match(path2)).to.be.true
    })

    it("does not match a given path", () => {
      const path1 = new Path("users", "0", "comments")
      const path2 = new Path("users", ".")

      expect(path1.match(path2)).to.be.false
    })
  })

  describe("#walk", () => {
    it("walks an object", () => {
      const path = new Path("users", "0", "comments", "1")
      const store = {
        users: [
          { name: "diego", comments: [{text: "LoL"}, {text: "Nice!"}]},
          { name: "Bianca", comments: []},
        ]
      }

      expect(path.walk(store)).to.deep.equal({text: "Nice!"})
    })

    it("walks an array", () => {
      const path = new Path("0", "name")
      const users = [
        { name: "diego", comments: [{text: "LoL"}, {text: "Nice!"}]},
        { name: "Bianca", comments: []},
      ]

      expect(path.walk(users)).to.equal("diego")
    })
  })

  describe("#reversedNodes", () => {
    it("returns the current path nodes in the reverse order", () => {
      const reversed = new Path("users", 0, "name").reversedNodes()

      expect(reversed).to.deep.equal(["name", 0, "users"])
    })
  })
})
