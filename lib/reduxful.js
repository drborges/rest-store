const resolve = (path, values = []) => {
  const parts = path.slice(1).split("/")
  const isParam = (part) => part[0] === ":"
  return parts.map(part => isParam(part) ? values.shift() : part)
}

export const Router = {
  resolve,
}

export default {
  Router,
}
