import { expect } from "chai"
import Store from "../lib/store"

describe("Store", () => {
  let store, resources;

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

      expect(store.state).to.deep.equal(stateAfter)
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

      expect(store.state).to.deep.equal(stateAfter)
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

      expect(store.state).to.deep.equal(stateAfter)
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

      expect(store.state).to.deep.equal(stateAfter)
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

      expect(store.state).to.deep.equal(stateAfter)
    })
  })

  describe("#resources", () => {
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

      delete resources.users[2].comments[0]

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

      delete resources.users[2].comments[0]

      expect(notifiedState).to.deep.equal(stateAfter)

      unsubscribe()

      resources.users[2].name = "matheus"

      expect(notifiedState).to.deep.equal(stateAfter)
    })
  })
})
