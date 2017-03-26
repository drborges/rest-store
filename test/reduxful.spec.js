import { expect } from "chai"
import { Store } from "../lib/reduxful"
import update from 'immutability-helper'

describe("Store", () => {
  describe("#POST", () => {
    const store = new Store({
      users: [
        { name: "diego", comments: [] },
        { name: "bibi" },
      ]
    })

    it("adds a new comment to the corresponding user", () => {
      const stateAfter = {
        users: [
          { name: "diego", comments: [{ text: "LoL" }] },
          { name: "bibi" },
        ]
      }

      store.POST("/users/0/comments", {
        text: "LoL",
      })

      expect(store.state).to.deep.equal(stateAfter)
    })
  })

  describe("#PATCH", () => {
    const store = new Store({
      users: [
        { name: "diego", comments: [] },
        { name: "bibi" },
        { name: "ronaldo", comments: [{ text: "LoL", id: 123 }] },
      ]
    })

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
    const store = new Store({
      users: [
        { name: "diego", comments: [] },
        { name: "bibi" },
        { name: "ronaldo", comments: [{ text: "LoL" }] },
      ]
    })

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
    const store = new Store({
      users: [
        { name: "diego", comments: [] },
        { name: "bibi" },
        { name: "ronaldo", comments: [{ text: "LoL" }] },
      ]
    })

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
