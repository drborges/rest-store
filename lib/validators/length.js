export default {
  min: (minLength) => (value, field = "value", message = `has to have a length of at least ${minLength}`) => {
    if (typeof value === "object") {
      value = Object.keys(value)
    }

    if (!value.length) {
      return null
    }

    return value.length <= minLength ? `${field} ${message}` : null
  },

  max: (maxLength) => (value, field = "value", message = `has to have a length of at least ${maxLength}`) => {
    if (typeof value === "object") {
      value = Object.keys(value)
    }

    if (!value.length) {
      return null
    }

    return value.length > maxLength ? `${field} ${message}` : null
  },
}
