import { expect } from "chai"
import createStore from "../lib/store"

describe("Store", () => {
  let store

  beforeEach(() => {
    store = createStore({
      users: [
        { name: "diego", comments: [] },
        { name: "bibi", comments: [] },
        { name: "ronaldo", comments: [{ text: "LoL", id: 123 }] },
      ]
    })
  })

  describe("#post", () => {
    it("adds a new comment to the corresponding user", () => {
      const stateAfter = {
        users: [
          { name: "diego", comments: [{ text: "LoL" }] },
          { name: "bibi", comments: [] },
          { name: "ronaldo", comments: [{ text: "LoL", id: 123 }] },
        ]
      }

      store.post("/users/0/comments", {
        text: "LoL",
      })

      expect(store.state()).to.deep.equal(stateAfter)
    })
  })

  describe("#patch", () => {
    it("patches a given user's comment", () => {
      const stateAfter = {
        users: [
          { name: "diego", comments: [] },
          { name: "bibi", comments: [] },
          { name: "ronaldo", comments: [{ text: "Nice!", id: 123 }] },
        ]
      }

      store.patch("/users/2/comments/0", {
        text: "Nice!"
      })

      expect(store.state()).to.deep.equal(stateAfter)
    })
  })

  describe("#put", () => {
    it("updates a given user with a whole new content", () => {
      const stateAfter = {
        users: [
          { name: "diego", comments: [] },
          { name: "bibi", comments: [] },
          { name: "Ronaldo" },
        ]
      }

      store.put("/users/2", {
        name: "Ronaldo",
      })

      expect(store.state()).to.deep.equal(stateAfter)
    })

    it("updates the name of a given user", () => {
      const stateAfter = {
        users: [
          { name: "diego", comments: [] },
          { name: "bibi", comments: [] },
          { name: "hernando", comments: [{ text: "LoL", id: 123 }] },
        ]
      }

      store.put("/users/2/name", "hernando")

      expect(store.state()).to.deep.equal(stateAfter)
    })
  })

  describe("#delete", () => {
    it("deletes the corresponding user's comment", () => {
      const stateAfter = {
        users: [
          { name: "diego", comments: [] },
          { name: "bibi", comments: [] },
          { name: "ronaldo", comments: [] },
        ]
      }

      store.delete("/users/2/comments/0")

      expect(store.state()).to.deep.equal(stateAfter)
    })
  })

  describe("#get", () => {
    it("gets the whole state from store", () => {
      const expectedSubtree = store.state()
      const subtree = store.get("/")

      expect(subtree).to.deep.equal(expectedSubtree)
    })

    it("gets subtree from store for the given path", () => {
      const expectedSubtree = { text: "LoL", id: 123 }
      const subtree = store.get("/users/2/comments/0")

      expect(subtree).to.deep.equal(expectedSubtree)
    })
  })

  describe("#map", () => {
    it("applies a mapping function to the corresponding subtree", () => {
      const stateAfter = {
        users: [
          { name: "diego", comments: [] },
          { name: "bibi", comments: [] },
          {
            name: "ronaldo", comments: [
              {
                text: "LoL",
                description: "more information added to the comment",
              }
            ]
          },
        ]
      }

      store.map("/users/2/comments/0", (comment) => {
        return {
          text: comment.text,
          description: "more information added to the comment",
        }
      })

      expect(store.state()).to.deep.equal(stateAfter)
    })
  })

  describe("#subscribe", () => {
    it("notifies listeners upon state mutations", () => {
      const stateAfter = {
        users: [
          { name: "diego", comments: [] },
          { name: "bibi", comments: [] },
          { name: "ronaldo", comments: [] },
        ]
      }

      let actualState = {}
      store.subscribe(state => { actualState = state })

      store.delete("/users/2/comments/0")
      expect(actualState).to.deep.equal(stateAfter)
    })

    it("unsubscribes listener from the store", () => {
      const stateAfter = {
        users: [
          { name: "diego", comments: [] },
          { name: "bibi", comments: [] },
          { name: "ronaldo", comments: [] },
        ]
      }

      let notifiedState = {}
      const unsubscribe = store.subscribe(state => { notifiedState = state })

      store.delete("/users/2/comments/0")
      expect(notifiedState).to.deep.equal(stateAfter)

      unsubscribe()

      store.put("/users/2/name", "matheus")
      expect(notifiedState).to.deep.equal(stateAfter)
    })
  })

  describe("#state", () => {
    it("returns a deep frozen copy of the internal state", () => {
      const stateCopy = store.state()
      expect(() => stateCopy.users[0].name = "jose").to.throw(TypeError)
    })
  })
})
