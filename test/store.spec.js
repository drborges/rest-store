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

  describe("#POST", () => {
    it("adds a new comment to the corresponding user", () => {
      const stateAfter = {
        users: [
          { name: "diego", comments: [{ text: "LoL" }] },
          { name: "bibi" },
          { name: "ronaldo", comments: [{ text: "LoL", id: 123 }] },
        ]
      }

      store.POST("/users/0/comments", {
        text: "LoL",
      })

      expect(store.state).to.deep.equal(stateAfter)
    })
  })

  describe("#PATCH", () => {
    it("patches a given user's comment", () => {
      const stateAfter = {
        users: [
          { name: "diego", comments: [] },
          { name: "bibi" },
          { name: "ronaldo", comments: [{ text: "Nice!", id: 123 }] },
        ]
      }

      store.PATCH("/users/2/comments/0", {
        text: "Nice!"
      })

      expect(store.state).to.deep.equal(stateAfter)
    })
  })

  describe("#PUT", () => {
    it("updates a given user with a whole new content", () => {
      const stateAfter = {
        users: [
          { name: "diego", comments: [] },
          { name: "bibi" },
          { name: "Ronaldo" },
        ]
      }

      store.PUT("/users/2", {
        name: "Ronaldo",
      })

      expect(store.state).to.deep.equal(stateAfter)
    })
  })

  describe("#DELETE", () => {
    it("deletes the corresponding user's comment", () => {
      const stateAfter = {
        users: [
          { name: "diego", comments: [] },
          { name: "bibi" },
          { name: "ronaldo", comments: [] },
        ]
      }

      store.DELETE("/users/2/comments/0")

      expect(store.state).to.deep.equal(stateAfter)
    })
  })
})
