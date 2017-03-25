
require("babel-register")()
var jsdom = require("jsdom").jsdom
var chai = require("chai")
var sinonChai = require("sinon-chai")
var chaiEnzyme = require("chai-enzyme")
var exposedProperties = ["window", "navigator", "document"]

chai.use(chaiEnzyme())
chai.use(sinonChai)

global.document = jsdom("")
global.window = document.defaultView
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === "undefined") {
    exposedProperties.push(property)
    global[property] = document.defaultView[property]
  }
})

global.navigator = {
  userAgent: "node.js"
}

documentRef = document

