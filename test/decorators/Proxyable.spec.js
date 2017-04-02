import sinon from "sinon"
import { expect } from "chai"

import { Proxyable } from "../../src/decorators"

describe("Proxyable", () => {

  @Proxyable
  class Person {
    constructor(name, age) {
      this.name = name
      this.age = age
    }

    get(target, prop, receiver) {
      return `${this.name} - ${this.age}`
    }
  }

  it("wraps type within a proxy", () => {
    const diego = new Person("Diego", 31)
    const bianca = new Person("Bianca", 23)

    expect(diego.personalInfo).to.equal("Diego - 31")
    expect(bianca.information).to.equal("Bianca - 23")
  })
})
