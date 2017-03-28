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

  describe("#val", () => {
    it("retrieves an existing comment from an existing user", () => {
      const comment = resources.users[2].comments[0].val()

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

      resources.users[2].comments.remove(0)

      expect(store.state).to.deep.equal(stateAfter)
    })
  })

  describe("#map", () => {
    it("maps over a list of resources", () => {
      const usersNames = resources.users.map(user => user.val().name)
      expect(usersNames).to.deep.equal([
        "diego", "bibi", "ronaldo"
      ])
    })
  })

  describe("#slice", () => {
    it("slices a resource collection", () => {
      const lastTwoUsers = resources.users.slice(1)
      expect(lastTwoUsers.val()).to.deep.equal(store.state.users.slice(1))
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

  describe("#Symbol.iterator", () => {
    it("triggers mutations from within for .. of", () => {
      const stateAfter = {
        users: [
          { name: "diego", comments: [{ text: "created from iterator"}] },
          { name: "bibi", comments: [{ text: "created from iterator"}] },
          { name: "ronaldo", comments: [{ text: "LoL", id: 123 }, { text: "created from iterator"}] },
        ]
      }

      for (let user of resources.users) {
        user.comments.push({ text: "created from iterator"})
      }

      expect(store.state).to.deep.equal(stateAfter)
    })

    it("destructs a resources list", () => {
      const [ diego, bibi, ronaldo ] = resources.users
      expect(diego.val()).to.equal(store.state.users[0])
      expect(bibi.val()).to.equal(store.state.users[1])
      expect(ronaldo.val()).to.equal(store.state.users[2])
    })

    it("supports spread operator on resources list", () => {
      const [ diego, ...rest ] = resources.users
      expect(diego.val()).to.equal(store.state.users[0])
      expect(rest.val()).to.deep.equal(store.state.users.slice(1))
    })

    it("properly iterates over ...rest of list", () => {
      const [ _, ...rest ] = resources.users
      let index = 1
      for (let item of rest) {
        expect(item.val()).to.deep.equal(store.state.users[index++])
      }
    })
  })
})
