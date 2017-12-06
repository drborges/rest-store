import sinon from "sinon"
import { expect } from "chai"

import Path from "../src/Path"
import ReStore from "../src/ReStore"

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
  let store: ReStore<MyState>

  beforeEach(() => {
    store = new ReStore({
      users: [
        { name: "Diego", comments: [] },
        { name: "Bianca", comments: [{ text: "Nice!" }] },
      ]
    })
  })

  describe("#get", () => {
    it("retrieve the current state for the root path", () => {
      const state = store.get(new Path)

      expect(state).to.deep.equal({
        users: [
          { name: "Diego", comments: [] },
          { name: "Bianca", comments: [{ text: "Nice!" }] },
        ]
      })
    })

    it("retrieve the current value for a given path", () => {
      const name = store.get(new Path("users", 0, "name"))

      expect(name).to.equal("Diego")
    })

    it("throws a 404 error if path does not exist", () => {
      expect(() => store.get(new Path("people", "0"))).to.throw("404: Path /people/0 is not valid")
    })
  })

  describe("#put", () => {
    it("updates path with new value", () => {
      const path = new Path("users", 0, "name")

      store.set(path, "Borges")

      expect(store.get(path)).to.equal("Borges")
    })
  })

  describe("#patch", () => {
    it("partially updates path with extra data", () => {
      const path = new Path("users", 0)

      store.merge(path, { age: 31 })

      expect(store.get(path)).to.deep.equal({
        name: "Diego",
        age: 31,
        comments: [],
      })
    })
  })

  describe("#map", () => {
    it("updates path through a mapping function", () => {
      const path = new Path("users", 0)

      store.map(path, (current) => ({ ...current, age: 31 }))

      expect(store.get(path)).to.deep.equal({
        name: "Diego",
        age: 31,
        comments: [],
      })
    })
  })

  describe("#delete", () => {
    it("removes an element from a path holding an array", () => {
      const path = new Path("users", 1, "comments")

      store.delete(path, 0)

      expect(store.get(path.child(0))).to.be.undefined
    })
  })

  describe("#subscribe", () => {
    it("notifies listeners upon #put operations", () => {
      store.subscribe(state => {
        expect(state).to.deep.equal({
          users: [
            { name: "Borges", comments: [] },
            { name: "Bianca", comments: [{ text: "Nice!" }] },
          ]
        })
      })

      store.set(new Path("users", 0, "name"), "Borges")
    })

    it("notifies listeners upon #patch operations", () => {
      store.subscribe(state => {
        expect(state).to.deep.equal({
          users: [
            { name: "Diego", comments: [], age: 32 },
            { name: "Bianca", comments: [{ text: "Nice!" }] },
          ]
        })
      })

      store.merge(new Path("users", 0), { age: 32 })
    })

    it("notifies listeners upon #map operations", () => {
      store.subscribe(state => {
        expect(state).to.deep.equal({
          users: [
            { name: "Diego", comments: [] },
            { name: "Bianca", comments: [{ text: "Nice!" }] },
            { name: "Hernando" },
          ]
        })
      })

      store.map(new Path("users"), (users) => [
        ...users,
        { name: "Hernando" },
      ])
    })

    it("notifies listeners upon #delete operations", () => {
      store.subscribe(state => {
        expect(state).to.deep.equal({
          users: [
            { name: "Diego", comments: [] },
          ]
        })
      })

      store.delete(new Path("users"), 1)
    })
  })
})
