import { expect } from "chai"
import length from "../../lib/validators/length"

describe("#length", () => {
  describe("#min", () => {
    it("does not fail validation when provided a string whose length is greater than the minimum required", () => {
      expect(length.min(3)("two")).to.equal(
        "value has to have a length of at least 3"
      )
    })

    it("does not fail validation when provided an array whose length is greater than the minimum required", () => {
      expect(length.min(3)([1, 2, 3])).to.equal(
        "value has to have a length of at least 3"
      )
    })

    it("does not fail validation when provided an object whose length is greater than the minimum required", () => {
      expect(length.min(3)({a:1, b:2, c:3})).to.equal(
        "value has to have a length of at least 3"
      )
    })

    it("fails validation when provided a string whose length is not at least the minimum required", () => {
      expect(length.min(3)("Hi")).to.equal(
        "value has to have a length of at least 3"
      )
    })

    it("fails validation when provided an array whose length is not at least the minimum required", () => {
      expect(length.min(3)([1, 2])).to.equal(
        "value has to have a length of at least 3"
      )
    })

    it("fails validation when provided an object whose length is not at least the minimum required", () => {
      expect(length.min(3)({a:1, b:2})).to.equal(
        "value has to have a length of at least 3"
      )
    })
  })

  describe("#max", () => {
    it("fails validation when string's length is greater than the maximum allowed", () => {
      expect(length.max(3)("Hello")).to.equal(
        "value has to have a length of at least 3"
      )
    })

    it("fails validation when array's length is greater than the maximum allowed", () => {
      expect(length.max(3)([1, 2, 3, 4])).to.equal(
        "value has to have a length of at least 3"
      )
    })

    it("fails validation when object's length is greater than the maximum allowed", () => {
      expect(length.max(3)({a:1, b:2, c:3, d:4})).to.equal(
        "value has to have a length of at least 3"
      )
    })
  })
})
