import sinon from "sinon"
import { expect } from "chai"

import Path from "../src/Path"
import ValueMutator from "../src/ValueMutator"

const stubWithArgs = (...args) => ({
  returns: (value) => {
    const stub = sinon.stub()
    stub.withArgs(...args).returns(value)
    return stub
  }
})

describe("ValueMutator", () => {
  describe("#set", () => {
    it("triggers a mutation in the store", () => {
      const store = { put: sinon.spy() }
      const userNamePath = new Path("users", "0", "name")
      const nameMutator = new ValueMutator(store, userNamePath)

      nameMutator.set("Borges")

      expect(store.put).to.have.been.calledWith(userNamePath, "Borges")
    })
  })

  describe("#get", () => {
    it("fetches underlying value from store", () => {
      const userNamePath = new Path("users", "1", "name")
      const store = { get: stubWithArgs(userNamePath).returns("Borges") }
      const nameMutator = new ValueMutator(store, userNamePath)

      const name = nameMutator.get()

      expect(name).to.equal("Borges")
    })
  })

  describe("@CahcedProxy", () => {
    it("caches value mutator to avoid memory leaks", () => {
      const mutator1 = new ValueMutator({}, new Path("users", "0", "name"))
      const mutator2 = new ValueMutator({}, new Path("users", "0", "name"))

      expect(mutator1).to.equal(mutator2)
    })
  })
})
