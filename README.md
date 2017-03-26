# rest-store

This is an attempt to bring some of the restful concepts into `React`-like stores, in order to make it easier to manage application state tree in a `Redux` friendly fashion, yet, reducing boilerplate.

### Creating a new store

```js
store = new Store({
  users: [
    { name: "diego", comments: [] },
    { name: "bibi", comments: [] },
  ]
})
```

### Defining Route Validations (TODO)

```js
store.validate.POST("/users", {
  name: [
    validations.string.required,
    validations.length.min(3),
  ],
  comments: [
    validations.array.default([]),
  ]
})

store.validate.PUT("/users/:userId", {
  name: [
    validations.string.required,
    validations.length.min(3),
  ],
  comments: [
    validations.array.default([]),
  ]
})

store.validate.PUT("/users/:userId/comments/:commentId", {
  text: [
    validations.string.required,
    validations.length.min(3),
  ],
})
```

### Mutating the state tree in a Redux friendly fashion

#### Store#POST - Creating data in the state tree

Given the `state` held by a `store`:

```js
{
  users: [
    { name: "diego", comments: [] },
    { name: "bibi", comments: [] },
  ]
}
```

The following code creates a new comment object for the user at index `1` in the `users` list:

```js
store.POST("/users/1/comments", {
  text: "A brand new comment",
})
```

Here's what the state after the mutation will look like:

```js
{
  users: [
    { name: "diego", comments: [] },
    { name: "bibi", comments: [{ text: "A brand new comment" }] },
  ]
}
```

#### Store#PUT - Completely updating a subtree

Given the `state` held by a `store`:

```js
{
  users: [
    { name: "diego", comments: [] },
    { name: "bibi", comments: [] },
  ]
}
```

The following code updates the user at index `1` in the `users` list, by completely replacing its contents with the given data `{ name: "Ronaldo" }` and applying the validation/default values:

```js
store.PUT("/users/1", {
  name: "Ronaldo",
})
```

Here's what the state after the mutation will look like:

```js
{
  users: [
    { name: "diego", comments: [] },
    { name: "Ronaldo", comments: [] },
  ]
}
```

#### Store#PATCH - Partially updating a subtree

Given the `state` held by a `store`:

```js
{
  users: [
    { name: "diego", comments: [] },
    { name: "bibi", comments: [{ text: "A brand new comment" }] },
  ]
}
```

The following code patches the text of the comment at index `0` in the `comments` list of the user at index `1` in the `users` list:

```js
store.PATCH("/users/1/comments/0", {
  text: "Updated comment text",
})
```

Here's what the state after the mutation will look like:

```js
{
  users: [
    { name: "diego", comments: [] },
    { name: "bibi", comments: [{ text: "Updated comment text" }] },
  ]
}
```
