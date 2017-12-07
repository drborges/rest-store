/* @flow */

import { expect } from "chai"

import Path from "../src/Path"
import ReStore from "../src/ReStore"
import StateTree from "../src/StateTree"

describe("StateTree", () => {
  context("manipulating proxy internals", () => {
    it("allows accessing $children proxies", () => {
      const data = { user: { name: "Diego", age: 32 }}
      const store = new ReStore(data)

      const stateTreeProxy = new StateTree(store).create()
      const userProxy = stateTreeProxy.user

      expect(stateTreeProxy.$children).to.deep.eq({
        [new Path("user")]: userProxy,
      })
    })

    it("performs a no-op when setting $children", () => {
      const data = { name: "Diego", age: 32 }
      const store = new ReStore(data)

      const stateTreeProxy = new StateTree(store).create()

      const $children = stateTreeProxy.$children
      stateTreeProxy.$children = null

      expect(stateTreeProxy.$children).to.not.eq(null)
      expect(stateTreeProxy.$children).to.eq($children)
      expect(data.$children).to.be.undefined
      expect(store.get(new Path("$children"))).to.be.undefined
    })
  })

  context("proxing objects", () => {
    it("provides a proxy with leaf children only", () => {
      const data = { name: "Diego", age: 32 }
      const store = new ReStore(data)

      const stateTreeProxy = new StateTree(store).create()

      expect(store.state).to.eq(data)
      expect(stateTreeProxy).to.not.eq(store.state)
      expect(stateTreeProxy).to.deep.eq(store.state)
      expect(stateTreeProxy).to.deep.eq(data)
    })

    it("provides a proxy with proxied children", () => {
      const data = { user: { name: "Diego", age: 32 }}
      const store = new ReStore(data)

      const userProxy = new StateTree(store).create(new Path("user"))

      expect(store.state).to.eq(data)
      expect(userProxy).to.not.eq(store.state.user)
      expect(userProxy).to.deep.eq(store.state.user)
      expect(userProxy).to.deep.eq(data.user)
    })

    it("caches proxied children", () => {
      const data = { user: { name: "Diego", age: 32 }}
      const store = new ReStore(data)

      const stateTreeProxy = new StateTree(store).create()
      const userProxy1 = stateTreeProxy.user
      const userProxy2 = stateTreeProxy.user

      expect(userProxy1).to.eq(userProxy2)
      expect(userProxy1).to.not.eq(data.user)
      expect(userProxy1).to.deep.eq(data.user)
    })

    context("mutation paths", () => {
      context("udating underlying store", () => {
        it("updates underlying store upon mutation on leaf node", () => {
          const data = { user: { name: "Diego", age: 32 }}
          const store = new ReStore(data)

          const stateTreeProxy = new StateTree(store).create()
          stateTreeProxy.user.name = "Borges"

          expect(data).to.not.eq(store.get(Path.root))
          expect(data.user).to.not.eq(store.get(new Path("user")))
          expect(data.user.name).to.not.eq(store.get(new Path("user", "name")))
          expect(store.get(new Path("user", "name"))).to.eq("Borges")
        })

        it("updates underlying store upon mutation on non-leaf node", () => {
          const data = { user: { name: "Diego", age: 32 }}
          const store = new ReStore(data)

          const stateTreeProxy = new StateTree(store).create()
          stateTreeProxy.user = { name: "Borges", age: 21 }

          expect(data).to.not.eq(store.get(Path.root))
          expect(data.user).to.not.eq(store.get(new Path("user")))
          expect(data.user.name).to.not.eq(store.get(new Path("user", "name")))
          expect(data.user.age).to.not.eq(store.get(new Path("user", "age")))
          expect(store.get(new Path("user", "name"))).to.eq("Borges")
          expect(store.get(new Path("user", "age"))).to.eq(21)
        })
      })

      context("refreshing affected proxies", () => {
        it("refreshes mutation path from leaf up until root node", () => {
          const data = { state: { user: { name: "Diego", age: 32 }}}
          const store = new ReStore(data)

          const storeProxy = new StateTree(store).create()
          const stateTreeProxy = storeProxy.state
          storeProxy.state.user.name = "Borges"

          expect(storeProxy).to.not.deep.eq(data)
          expect(storeProxy.state).to.not.eq(stateTreeProxy)
          expect(data.state.user.name).to.eq("Diego")
          expect(storeProxy.state.user.name).to.eq("Borges")
        })

        it("refreshes mutation path from non-leaf up until root node", () => {
          const data = { state: { user: { name: "Diego", age: 32 }}}
          const store = new ReStore(data)

          const storeProxy = new StateTree(store).create()
          const stateTreeProxy = storeProxy.state
          storeProxy.state.user = { name: "Borges", age: 21 }

          expect(storeProxy).to.not.deep.eq(data)
          expect(storeProxy.state).to.not.eq(stateTreeProxy)
          expect(data.state.user.name).to.eq("Diego")
          expect(storeProxy.state.user.name).to.eq("Borges")
        })

        it("leaves untouched nodes alone", () => {
          const data = { state: { user: { name: "Diego", comments: [{ text: "Sweet!" }]}}}
          const store = new ReStore(data)

          const storeProxy = new StateTree(store).create()
          const stateTreeProxy = storeProxy.state
          const userProxy = storeProxy.state.user
          const commentsProxy = storeProxy.state.user.comments

          storeProxy.state.user.name = "Borges"

          expect(storeProxy).to.not.deep.eq(data)
          expect(storeProxy.state).to.not.eq(stateTreeProxy)
          expect(storeProxy.state.user).to.not.eq(userProxy)
          expect(storeProxy.state.user.comments).to.eq(commentsProxy)
          expect(storeProxy.state.user.name).to.eq("Borges")
        })
      })
    })
  })

  context("proxing arrays", () => {
    it("provides a proxy with leaf children only", () => {
      const data = ["Diego", "Borges"]
      const store = new ReStore(data)

      const stateTreeProxy = new StateTree(store).create()

      expect(store.state).to.eq(data)
      expect(stateTreeProxy).to.not.eq(store.state)
      expect(stateTreeProxy).to.deep.eq(store.state)
      expect(stateTreeProxy).to.deep.eq(data)
    })

    it("provides a proxy with proxied children", () => {
      const data = {
        users: [
          { name: "Diego", age: 32 },
          { name: "Borges", age: 21 },
        ]
      }

      const store = new ReStore(data)

      const usersProxy = new StateTree(store).create(new Path("users"))

      expect(store.state).to.eq(data)
      expect(usersProxy).to.not.eq(store.state.users)
      expect(usersProxy).to.deep.eq(store.state.users)
      expect(usersProxy[0]).to.not.eq(store.state.users[0])
      expect(usersProxy[0]).to.deep.eq(store.state.users[0])
      expect(usersProxy[1]).to.not.eq(store.state.users[1])
      expect(usersProxy[1]).to.deep.eq(store.state.users[1])
    })

    it("caches proxied children", () => {
      const data = {
        users: [
          { name: "Diego", age: 32 },
          { name: "Borges", age: 21 },
        ]
      }

      const store = new ReStore(data)
      const stateTreeProxy = new StateTree(store).create()
      const usersProxy1 = stateTreeProxy.users
      const usersProxy2 = stateTreeProxy.users

      expect(usersProxy1).to.eq(usersProxy2)
      expect(usersProxy1).to.not.eq(data.users)
      expect(usersProxy1).to.deep.eq(data.users)
    })

    context("mutation paths", () => {
      context("udating underlying store", () => {
        it("updates underlying store upon mutation on leaf node", () => {
          const data = {
            users: [
              { name: "Diego", age: 32 },
              { name: "Borges", age: 21 },
            ]
          }

          const store = new ReStore(data)

          const stateTreeProxy = new StateTree(store).create()
          stateTreeProxy.users[1].name = "Bianca"

          expect(data).to.not.eq(store.get(Path.root))
          expect(data.users).to.not.eq(store.get(new Path("users")))
          expect(data.users[1]).to.not.eq(store.get(new Path("users", 1)))
          expect(data.users[1].name).to.not.eq(store.get(new Path("users", 1, "name")))
          expect(data.users[0]).to.eq(store.get(new Path("users", 0)))
          expect(store.get(new Path("users", 1, "name"))).to.eq("Bianca")
        })

        it("updates underlying store upon mutation on non-leaf node", () => {
          const data = {
            users: [
              { name: "Diego", age: 32 },
              { name: "Borges", age: 21 },
            ]
          }

          const store = new ReStore(data)

          const stateTreeProxy = new StateTree(store).create()
          stateTreeProxy.users[1] = { name: "Bianca", age: 24 }

          expect(data).to.not.eq(store.get(Path.root))
          expect(data.users).to.not.eq(store.get(new Path("users")))
          expect(data.users[1]).to.not.eq(store.get(new Path("users", 1)))
          expect(data.users[1]).to.not.deep.eq(store.get(new Path("users", 1)))
          expect(data.users[0]).to.eq(store.get(new Path("users", 0)))

          expect(store.get(new Path("users", 1, "name"))).to.eq("Bianca")
          expect(store.get(new Path("users", 1, "age"))).to.eq(24)
        })
      })

      context("refreshing affected proxies", () => {
        it("refreshes mutation path from leaf up until root node", () => {
          const data = {
            state: {
              users: [
                "Diego",
                "Borges",
              ]
            }
          }

          const store = new ReStore(data)

          const storeProxy = new StateTree(store).create()
          const stateTreeProxy = storeProxy.state
          const usersProxy = storeProxy.state.users
          storeProxy.state.users[1] = "Bianca"

          expect(storeProxy).to.not.deep.eq(data)
          expect(storeProxy.state).to.not.eq(stateTreeProxy)
          expect(storeProxy.state.users).to.not.eq(usersProxy)
          expect(data.state.users[1]).to.eq("Borges")
          expect(storeProxy.state.users[1]).to.eq("Bianca")
        })

        it("refreshes mutation path from non-leaf up until root node", () => {
          const data = {
            state: {
              users: [
                { name: "Diego", age: 32 },
                { name: "Borges", age: 21 },
              ]
            }
          }

          const store = new ReStore(data)

          const storeProxy = new StateTree(store).create()
          const stateTreeProxy = storeProxy.state
          const usersProxy = storeProxy.state.users
          storeProxy.state.users[1] = { name: "Bianca", age: 24 }

          expect(storeProxy).to.not.deep.eq(data)
          expect(storeProxy.state).to.not.eq(stateTreeProxy)
          expect(storeProxy.state.users).to.not.eq(usersProxy)
          expect(data.state.users[1].name).to.eq("Borges")
          expect(data.state.users[1].age).to.eq(21)
          expect(storeProxy.state.users[1].name).to.eq("Bianca")
          expect(storeProxy.state.users[1].age).to.eq(24)
        })

        it("leaves untouched nodes alone", () => {
          const data = { state: { users: [{ name: "Diego", comments: [{ text: "sweet!" }] }, { name: "Bianca" }]}}
          const store = new ReStore(data)

          const storeProxy = new StateTree(store).create()
          const stateTreeProxy = storeProxy.state
          const usersProxy = storeProxy.state.users
          const diegoProxy = storeProxy.state.users[0]
          const biancaProxy = storeProxy.state.users[1]
          const diegoCommentsProxy = storeProxy.state.users[0].comments

          storeProxy.state.users[0].name = "Borges"

          expect(storeProxy).to.not.deep.eq(data)
          expect(storeProxy.state).to.not.eq(stateTreeProxy)
          expect(storeProxy.state.users).to.not.eq(usersProxy)
          expect(storeProxy.state.users[0]).to.not.eq(diegoProxy)
          expect(storeProxy.state.users[0].comments).to.eq(diegoCommentsProxy)
          expect(storeProxy.state.users[1]).to.eq(biancaProxy)
        })
      })

      describe("#push", () => {
        it("mutates underlying store", () => {
          const data = {
            users: [
              { name: "Diego", age: 32 },
              { name: "Borges", age: 21 },
            ]
          }

          const store = new ReStore(data)
          const storeProxy = new StateTree(store).create()
          storeProxy.users.push({ name: "Bianca", age: 24 })

          expect(storeProxy.users).to.deep.eq(store.get(new Path("users")))

          expect(data).to.deep.eq({
            users: [
              { name: "Diego", age: 32 },
              { name: "Borges", age: 21 },
            ]
          })

          expect(store.get(new Path("users"))).to.deep.eq([
            { name: "Diego", age: 32 },
            { name: "Borges", age: 21 },
            { name: "Bianca", age: 24 },
          ])
        })
      })

      describe("#pop", () => {
        it("mutates underlying store", () => {
          const data = {
            users: [
              { name: "Diego", age: 32 },
              { name: "Borges", age: 21 },
            ]
          }

          const store = new ReStore(data)
          const storeProxy = new StateTree(store).create()
          const lastUser = storeProxy.users.pop()

          expect(storeProxy.users).to.deep.eq(store.get(new Path("users")))

          expect(lastUser).to.eq(data.users[1])

          expect(data).to.deep.eq({
            users: [
              { name: "Diego", age: 32 },
              { name: "Borges", age: 21 },
            ]
          })

          expect(store.get(new Path("users"))).to.deep.eq([
            { name: "Diego", age: 32 },
          ])
        })
      })

      describe("#filter", () => {
        it("filters out proxied items", () => {
          const data = {
            users: [
              { name: "Diego", age: 32 },
              { name: "Borges", age: 21 },
            ]
          }

          const store = new ReStore(data)
          const storeProxy = new StateTree(store).create()
          const filtered = storeProxy.users.filter(user => user.age < 30)

          expect(filtered).to.deep.eq([
            data.users[1],
          ])

          filtered[0].name = "Bianca"

          expect(storeProxy.users[0].name).to.eq("Diego")
          expect(storeProxy.users[1].name).to.eq("Bianca")
          expect(store.get(new Path("users", 1)).name).to.eq(storeProxy.users[1].name)
        })
      })

      describe("#splice", () => {
        it("removes elements from array adding new ones", () => {
          const data = {
            users: [
              { name: "Diego", age: 32 },
              { name: "Borges", age: 21 },
            ]
          }

          const store = new ReStore(data)
          const storeProxy = new StateTree(store).create()
          const removed = storeProxy.users.splice(0, 1, { name: "Bianca", age: 24 }, { name: "Ronaldo", age: 32 })

          expect(removed).to.deep.eq([
            data.users[0],
          ])

          expect(storeProxy.users).to.deep.eq([
            { name: "Bianca", age: 24 },
            { name: "Ronaldo", age: 32 },
            { name: "Borges", age: 21 },
          ])

          expect(storeProxy.users).to.deep.eq(store.get(new Path("users")))
        })
      })
    })
  })
})
