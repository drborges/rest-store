import { expect } from "chai"
import Store from "../lib/store"

describe("#resources", () => {
  let store, resources

  beforeEach(() => {
    store = new Store({
      users: [
        { name: "diego", comments: [] },
        { name: "bibi", comments: [] },
        { name: "ronaldo", comments: [{ text: "LoL", id: 123 }] },
      ]
    })

    resources = store.resources()
  })

  describe("#fetch", () => {
    it("retrieves an existing comment from an existing user", () => {
      const comment = resources.users[2].comments[0].fetch()

      expect(comment).to.deep.equal({ text: "LoL", id: 123 })
    })
  })

  describe("#=", () => {
    it("sets the contents of an existing comment", () => {
      const stateAfter = {
        users: [
          { name: "diego", comments: [] },
          { name: "bibi", comments: [{ text: "new comment" }] },
          { name: "ronaldo", comments: [{ text: "LoL", id: 123 }] },
        ]
      }

      resources.users[1].comments[0] = {
        text: "new comment",
      }

      expect(store.state).to.deep.equal(stateAfter)
    })
  })

  describe("#push", () => {
    it("adds a new comment to an existing user", () => {
      const stateAfter = {
        users: [
          { name: "diego", comments: [] },
          { name: "bibi", comments: [{ text: "new comment" }] },
          { name: "ronaldo", comments: [{ text: "LoL", id: 123 }] },
        ]
      }

      resources.users[1].comments.push({
        text: "new comment",
      })

      expect(store.state).to.deep.equal(stateAfter)
    })
  })

  describe("#merge", () => {
    it("merges data into an existing comment from an existing user", () => {
      const stateAfter = {
        users: [
          { name: "diego", comments: [] },
          { name: "bibi", comments: [] },
          { name: "ronaldo", comments: [{ text: "LoL", id: 123, description: "more data in the comment" }] },
        ]
      }

    resources.users[2].comments[0].merge({
        description: "more data in the comment",
      })

      expect(store.state).to.deep.equal(stateAfter)
    })
  })

  describe("#delete", () => {
    it("deletes an existing comment from an existing user", () => {
      const stateAfter = {
        users: [
          { name: "diego", comments: [] },
          { name: "bibi", comments: [] },
          { name: "ronaldo", comments: [] },
        ]
      }

      resources.users[2].comments[0].delete()

      expect(store.state).to.deep.equal(stateAfter)
    })
  })

  describe("delete operator", () => {
    it("deletes an existing comment from an existing user", () => {
      const stateAfter = {
        users: [
          { name: "diego", comments: [] },
          { name: "bibi", comments: [] },
          { name: "ronaldo", comments: [] },
        ]
      }

      delete resources.users[2].comments[0]

      expect(store.state).to.deep.equal(stateAfter)
    })
  })

  describe("#map", () => {
    it("maps over a list of resources", () => {
      const usersNames = resources.users.map(user => user.fetch().name)
      expect(usersNames).to.deep.equal([
        "diego", "bibi", "ronaldo"
      ])
    })
  })

  describe("multiple resources", () => {
    it("allows resources to be mutated independently", () => {
      const firstUser = resources.users[0]
      const lastUser = resources.users[2]
      const lastUserComment = lastUser.comments[0]

      firstUser.name = "hernando"
      lastUser.name = "giulianna"
      lastUserComment.text = "new comment text"

      expect(store.state.users[0].name).to.equal("hernando")
      expect(store.state.users[2].name).to.equal("giulianna")
      expect(store.state.users[2].comments[0].text).to.equal("new comment text")
    })
  })
})
