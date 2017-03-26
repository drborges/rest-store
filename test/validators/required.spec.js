import { expect } from "chai"
import required from "../../lib/validators/required"

describe("#required", () => {
  it("does not fail validation when a non-empty string is provided", () => {
    expect(required("Hello")).to.be.null
  })

  it("does not fail validation when zero is provided", () => {
    expect(required(0)).to.be.null
  })

  it("does not fail validation when a non-zero number is provided", () => {
    expect(required(123)).to.be.null
  })

  it("does not fail validation when a non-empty array is provided", () => {
    expect(required([ 1 ])).to.be.null
  })

  it("does not fail validation when a non-empty object is provided", () => {
    expect(required({ a: 1 })).to.be.null
  })

  it("fails validation when provided an empty string", () => {
    expect(required("")).to.equal(
      "value cannot be empty"
    )
  })

  it("fails validation when provided null", () => {
    expect(required(null)).to.equal(
      "value cannot be empty"
    )
  })

  it("fails validation when provided undefined", () => {
    expect(required(undefined)).to.equal(
      "value cannot be empty"
    )
  })

  it("fails validation when provided an empty array", () => {
    expect(required([])).to.equal(
      "value cannot be empty"
    )
  })

  it("fails validation when provided an empty object", () => {
    expect(required({})).to.equal(
      "value cannot be empty"
    )
  })

  it("returns default error message", () => {
    expect(required("")).to.equal(
      "value cannot be empty"
    )
  })

  it("returns default error message with custom field name", () => {
    expect(required("", "name")).to.equal(
      "name cannot be empty"
    )
  })

  it("returns custom error message with custom field name", () => {
    expect(required("", "name", "cannot be blank")).to.equal(
      "name cannot be blank"
    )
  })
})
