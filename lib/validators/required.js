export default function(value, field = "value", message = "cannot be empty") {
  if (value == null || value === "" || (typeof(value) === "object" && !Object.keys(value).length)) {
    return `${field} ${message}`
  }

  return null
}
