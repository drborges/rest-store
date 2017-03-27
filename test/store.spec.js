import { expect } from "chai"
import { Store } from "../lib/store"

describe("Store", () => {
  let store;

  beforeEach(() => {
    store = new Store({
      users: [
        { name: "diego", comments: [] },
        { name: "bibi" },
        { name: "ronaldo", comments: [{ text: "LoL", id: 123 }] },
      ]
    })
  })

  describe("#post", () => {
    it("adds a new comment to the corresponding user", () => {
      const stateAfter = {
        users: [
          { name: "diego", comments: [{ text: "LoL" }] },
          { name: "bibi" },
          { name: "ronaldo", comments: [{ text: "LoL", id: 123 }] },
        ]
      }

      store.post("/users/0/comments", {
        text: "LoL",
      })

      expect(store.state).to.deep.equal(stateAfter)
    })
  })

  describe("#patch", () => {
    it("patches a given user's comment", () => {
      const stateAfter = {
        users: [
          { name: "diego", comments: [] },
          { name: "bibi" },
          { name: "ronaldo", comments: [{ text: "Nice!", id: 123 }] },
        ]
      }

      store.patch("/users/2/comments/0", {
        text: "Nice!"
      })

      expect(store.state).to.deep.equal(stateAfter)
    })
  })

  describe("#put", () => {
    it("updates a given user with a whole new content", () => {
      const stateAfter = {
        users: [
          { name: "diego", comments: [] },
          { name: "bibi" },
          { name: "Ronaldo" },
        ]
      }

      store.put("/users/2", {
        name: "Ronaldo",
      })

      expect(store.state).to.deep.equal(stateAfter)
    })
  })

  describe("#delete", () => {
    it("deletes the corresponding user's comment", () => {
      const stateAfter = {
        users: [
          { name: "diego", comments: [] },
          { name: "bibi" },
          { name: "ronaldo", comments: [] },
        ]
      }

      store.delete("/users/2/comments/0")

      expect(store.state).to.deep.equal(stateAfter)
    })
  })

  describe("#get", () => {
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
          { name: "bibi" },
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

      expect(store.state).to.deep.equal(stateAfter)
    })
  })
})
