# rest-store

This is an attempt to bring some of the restful concepts into `React`-like stores in order to make it easier to manage application state tree in a `Redux` friendly fashion and at the same time reduce boilerplate.

### Creating a New Store

```js
store = new Store({
  users: [
    { name: "diego", comments: [] },
    { name: "bibi", comments: [] },
  ]
})
```

### Mutating State: Make Redux Happy <3

There are essentially two ways to mutate state in `rest-store` and both are `Redux` friendly, where state is never mutated directly, but instead, a new state with all mutations applied is created.

### Mutations: Restful API

This approach is based on Restful API abstractions, where restful operations are applied to resource paths, which, then, are mapped accordingly to subtrees in the state tree held by the `Store`.

#### Store#post - Creating Data

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
store.post("/users/1/comments", {
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

#### Store#put - Replacing Data

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
store.put("/users/1", {
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

#### Store#patch - Merging Data

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
store.patch("/users/1/comments/0", {
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

#### Store#delete - Deleting Data

Given the `state` held by a `store`:

```js
{
  users: [
    { name: "diego", comments: [] },
    { name: "bibi", comments: [{ text: "A brand new comment" }] },
  ]
}
```

The following code deletes the comment at index `0` in the `comments` list of the user at index `1` in the `users` list:

```js
store.delete("/users/1/comments/0")
```

Here's what the state after the mutation will look like:

```js
{
  users: [
    { name: "diego", comments: [] },
    { name: "bibi", comments: [] },
  ]
}
```

#### Store#get - Fetching Data

Given the `state` held by a `store`:

```js
{
  users: [
    { name: "diego", comments: [] },
    { name: "bibi", comments: [{ text: "A brand new comment" }] },
  ]
}
```

The following code fetches the comment at index `0` in the `comments` list of the user at index `1` in the `users` list:

```js
const comment = store.get("/users/1/comments/0")
=> { text: "A brand new comment" }
```

#### Store#map - Transforming Data

Given the `state` held by a `store`:

```js
{
  users: [
    { name: "diego", comments: [] },
    { name: "bibi", comments: [{ text: "A brand new comment" }] },
  ]
}
```

The following code applies a mapping function to the comment at index `0` in the `comments` list of the user at index `1` in the `users` list:

```js
store.map("/users/1/comments/0", (comment) => ({
  text: comment.text,
  description: "Comment was transformed by a mapping function",
}))
```

Here's what the state after the mutation will look like:

```js
{
  users: [
    { name: "diego", comments: [] },
    { name: "bibi", comments: [
        {
          text: "A brand new comment",
          description: "Comment was transformed by a mapping function",
        }
      ]
    },
  ]
}
```

### Mutations: Resources API

This approach provides a method chaining interface built on top of ES6 Proxy, making mutations as easy as manipulating a regular javascript object.

Consider the following `Store` for the next examples:

```js
store = new Store({
  users: [
    { name: "diego", comments: [] },
    { name: "bibi", comments: [] },
    { name: "ronaldo", comments: [{ text: "LoL", id: 123 }] },
  ]
})
```

Adding new data into the store is simply a matter of setting values to javascript objects in the corresponding path of the state tree:

```js
store.resources().users[2].comments[0].text = "new comment text"
```

The code above is basically **setting** the `text` property of the comment at position `0` belonging to the user at the position `2` in the `users` list.

Here's what the state will look like after the code above is executed:

```js
{
  users: [
    { name: "diego", comments: [] },
    { name: "bibi", comments: [] },
    { name: "ronaldo", comments: [{ text: "new comment text", id: 123 }] },
  ]
}
```

Similarly, one may **push** new items into arrays, for example:

```js
store.resources().users[1].comments.push({ text: "a new comment" })
```

The code above create a new state with the proper mutation applied:

```js
{
  users: [
    { name: "diego", comments: [] },
    { name: "bibi", comments: [{ text: "a new comment" }] },
    { name: "ronaldo", comments: [{ text: "new comment text", id: 123 }] },
  ]
}
```

**Merging** data into existing object is as easy:

```js
store.resources().users[1].comments[0].merge({ id: 123 })
```

And the new state:

```js
{
  users: [
    { name: "diego", comments: [] },
    { name: "bibi", comments: [{ text: "a new comment", id: 123 }] },
    { name: "ronaldo", comments: [{ text: "new comment text", id: 123 }] },
  ]
}
```

Here's how you would go about **deleting** elements from a list:

```js
store.resources().users[1].comments[0].delete()
// or
delete store.resources().users[1].comments[0]
```

And the resulting state:

```js
{
  users: [
    { name: "diego", comments: [] },
    { name: "bibi", comments: [] },
    { name: "ronaldo", comments: [{ text: "new comment text", id: 123 }] },
  ]
}
```

You may also retrieve parts of the state tree:

```js
const firstComment = store.resources().users[2].comments[0].fetch()
=> { text: "new comment text", id: 123 }
```
