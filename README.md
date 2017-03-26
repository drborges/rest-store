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

### Creating a Model Driven API

You are free to build your own domain specific API on top of `rest-store`. Say your application consists of users and each user may have a list of comments. The following code, provide a domain specific API which encapsulates `rest-store` operations, providing a simpler interface.

```js
const createMemberApi = (store) => (path) => ({
  merge: (data) => store.PATCH(path, data),
  update: (data) => store.PUT(path, data),
  delete: () => store.DELETE(path),
})

const memberApiFor = createMemberApi(store)

store.actions.users = {
  add: (userData) => store.POST("/users", userData),
  at: (userIndex) => {
    return {
      ...memberApiFor(`/users/${userIndex}`),
      comments: {
        add: (commentData) => store.POST(`/users/${userIndex}/comments`, commentData),
        at: (commentIndex) => {
          return memberApiFor(`${commentsPath}/${commentIndex}`)
        }
      }
  }
}
```

In the coming future, there will be a generator that will spit out the actions API based off of the rest paths used to access data in the store. Here's how one would use the API:

##### Adding new users

```js
store.actions.users.add({
  name: "diego",
})
```

##### Deleting an existing user

```js
store.actions.users.at(userIndex).delete()
```

##### Adding a new comment to an existing user

```js
store.actions.users.at(userIndex).comments.add({
  text: "Brand new comment",
})
```

##### Merging data to an existing comment of an existing user

```js
store.actions.users.at(userIndex).comments.at(commentIndex).merge({
  id: 123,
  text: "Updated comment text ",
})
```
