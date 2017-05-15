import sinon from "sinon"
import { expect } from "chai"

import Path from "../src/Path"
import Store from "../src/Store"
import { ObjectMutator } from "../src/mutators"

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

describe("Store", () => {
  let store: Store<MyState>

  beforeEach(() => {
    store = new Store({
      users: [
        { name: "Diego", comments: [] },
        { name: "Bianca", comments: [{ text: "Nice!" }] },
      ]
    })
  })

  describe("#get", () => {
    it("retrieve the current state for the root path", () => {
      const state = store.rest.get(new Path)

      expect(state).to.deep.equal({
        users: [
          { name: "Diego", comments: [] },
          { name: "Bianca", comments: [{ text: "Nice!" }] },
        ]
      })
    })

    it("retrieve the current value for a given path", () => {
      const name = store.rest.get(new Path("users", 0, "name"))

      expect(name).to.equal("Diego")
    })

    it("throws a 404 error if path does not exist", () => {
      expect(() => store.rest.get(new Path("people", "0"))).to.throw("404: Path /people/0 is not valid")
    })
  })

  describe("#put", () => {
    it("updates path with new value", () => {
      const path = new Path("users", 0, "name")

      store.rest.put(path, "Borges")

      expect(store.rest.get(path)).to.equal("Borges")
    })
  })

  describe("#patch", () => {
    it("partially updates path with extra data", () => {
      const path = new Path("users", 0)

      store.rest.patch(path, { age: 31 })

      expect(store.rest.get(path)).to.deep.equal({
        name: "Diego",
        age: 31,
        comments: [],
      })
    })
  })

  describe("#map", () => {
    it("updates path through a mapping function", () => {
      const path = new Path("users", 0)

      store.rest.map(path, (current) => ({ ...current, age: 31 }))

      expect(store.rest.get(path)).to.deep.equal({
        name: "Diego",
        age: 31,
        comments: [],
      })
    })
  })

  describe("#delete", () => {
    it("removes an element from a path holding an array", () => {
      const path = new Path("users", 1, "comments")

      store.rest.delete(path, 0)

      expect(store.rest.get(path.child(0))).to.be.undefined
    })
  })

  describe("#state", () => {
    describe("accessing data", () => {
      it("exposes state as a mutator implementation", () => {
        expect(store.rest.get(Path.root)).to.deep.equal({
          users: [
            { name: "Diego", comments: [] },
            { name: "Bianca", comments: [{ text: "Nice!" }] },
          ]
        })
      })

      it("retrieves state subtree", () => {
        expect(store.state.users[1].name).to.equal("Bianca")
      })
    })

    describe("mutating data", () => {
      it("exposes state as a mutator implementation", () => {
        store.state.users[0].comments.push({ text: "Sweet!" })

        expect(store.rest.get(Path.root)).to.deep.equal({
          users: [
            { name: "Diego", comments: [{ text: "Sweet!" }] },
            { name: "Bianca", comments: [{ text: "Nice!" }] },
          ]
        })
      })
    })
  })
})
