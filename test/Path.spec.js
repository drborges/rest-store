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

  describe("#parse", () => {
    it("parses a given path string representation", () => {
      const path = "/users/1/comments";
      const parsed = Path.parse(path);

      expect(parsed.toString()).to.eq(path);
    });
  });

  describe("#isAncestorOf", () => {
    it("detects descendants of a given path", () => {
      const ancestor = new Path("users", "1")
      const descendant1 = new Path("users", "1", "name")
      const descendant2 = new Path("users", "1", "comments")
      const nonDescendant = new Path("users", "0", "comments")

      expect(ancestor.isAncestorOf(descendant1)).to.eq(true)
      expect(ancestor.isAncestorOf(descendant2)).to.eq(true)
      expect(ancestor.isAncestorOf(nonDescendant)).to.eq(false)
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

  describe("@@iterator", () => {
    it("implements the iterator protocol", () => {
      const nodes = []
      const path = new Path("users", 0, "name")

      for (const node of path) {
        nodes.push(node)
      }

      expect(nodes).to.deep.equal(["users", 0, "name"])
    })

    it("desctructs path into nodes", () => {
      const [head, ...tail] = new Path("users", 0, "name")
      expect(head).to.equal("users")
      expect(tail).to.deep.equal([0, "name"])
    })
  })
})
