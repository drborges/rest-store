import { expect } from "chai"
import deepFreeze from "deep-freeze"
import createStore from "../lib/store"

describe("Store", () => {
  let store

  beforeEach(() => {
    store = createStore(deepFreeze({
      users: [
        { name: "diego", comments: [] },
        { name: "bibi", comments: [] },
        { name: "ronaldo", comments: [{ text: "LoL", id: 123 }] },
      ]
    }))
  })

  describe("#val", () => {
    it("retrieves an existing comment from an existing user", () => {
      const comment = store.resources.users[2].comments[0].val()

      expect(comment).to.deep.equal({ text: "LoL", id: 123 })
    })
  })

  describe("#=", () => {
    it("sets the contents of an existing resource member", () => {
      const stateAfter = {
        users: [
          { name: "diego", comments: [] },
          { name: "bibi", comments: [{ text: "new comment" }] },
          { name: "ronaldo", comments: [{ text: "LoL", id: 123 }] },
        ]
      }

      store.resources.users[1].comments[0] = {
        text: "new comment",
      }

      expect(store.resources.val()).to.deep.equal(stateAfter)
    })

    it("sets the contents of an existing resource collection", () => {
      const stateAfter = {
        users: [
          { name: "diego", comments: [] },
        ]
      }

      store.resources.users = [
        { name: "diego", comments: [] },
      ]

      expect(store.resources.val()).to.deep.equal(stateAfter)
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

      store.resources.users[1].comments.push({
        text: "new comment",
      })

      expect(store.resources.val()).to.deep.equal(stateAfter)
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

      store.resources.users[2].comments[0].merge({
        description: "more data in the comment",
      })

      expect(store.resources.val()).to.deep.equal(stateAfter)
    })
  })

  describe("#remove", () => {
    it("removes an existing comment from an existing user", () => {
      const stateAfter = {
        users: [
          { name: "diego", comments: [] },
          { name: "bibi", comments: [] },
          { name: "ronaldo", comments: [] },
        ]
      }

      store.resources.users[2].comments.remove(0)

      expect(store.resources.val()).to.deep.equal(stateAfter)
    })
  })

  describe("#map", () => {
    it("maps over a list of resources", () => {
      const usersNames = store.resources.users.map(user => user.val().name)
      expect(usersNames).to.deep.equal([
        "diego", "bibi", "ronaldo"
      ])
    })
  })

  describe("#filter", () => {
    it("filters elements from a resource collection", () => {
      const filtered = store.resources.users.filter(user => user.name === "bibi")
      expect(filtered.val()).to.deep.equal(store.resources.val().users.slice(1, 1))
    })
  })

  describe("#slice", () => {
    it("slices a resource collection", () => {
      const lastTwoUsers = store.resources.users.slice(1)
      expect(lastTwoUsers.val()).to.deep.equal(store.resources.val().users.slice(1))
    })
  })

  describe("multiple resources", () => {
    it("allows resources to be mutated independently", () => {
      const firstUser = store.resources.users[0]
      const lastUser = store.resources.users[2]
      const lastUserComment = lastUser.comments[0]

      firstUser.name = "hernando"
      lastUser.name = "giulianna"
      lastUserComment.text = "new comment text"

      expect(store.resources.users[0].name.val()).to.equal("hernando")
      expect(store.resources.users[2].name.val()).to.equal("giulianna")
      expect(store.resources.users[2].comments[0].text.val()).to.equal("new comment text")
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

      for (let user of store.resources.users) {
        user.comments.push({ text: "created from iterator"})
      }

      expect(store.resources.val()).to.deep.equal(stateAfter)
    })

    it("destructs a resources list", () => {
      const [ diego, bibi, ronaldo ] = store.resources.users
      expect(diego.val()).to.equal(store.resources.val().users[0])
      expect(bibi.val()).to.equal(store.resources.val().users[1])
      expect(ronaldo.val()).to.equal(store.resources.val().users[2])
    })

    it("supports spread operator on resources list", () => {
      const [ diego, ...rest ] = store.resources.users
      expect(diego.val()).to.equal(store.resources.val().users[0])
      expect(rest.val()).to.deep.equal(store.resources.val().users.slice(1))
    })

    it("properly iterates over ...rest of list", () => {
      const [ _, ...rest ] = store.resources.users
      let index = 1
      for (let item of rest) {
        expect(item.val()).to.deep.equal(store.resources.val().users[index++])
      }
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

      store.resources.users[2].comments.remove(0)
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

      store.resources.users[2].comments.remove(0)
      expect(notifiedState).to.deep.equal(stateAfter)

      unsubscribe()

      store.resources.users[2].name = "matheus"
      expect(notifiedState).to.deep.equal(stateAfter)
    })
  })
})
