# rest-store

State management made with ❤️.

State management is nowadays one of the challenges faced by Javascript developers. There are pretty good solutions out there such as `Redux` and `MobX`.



# Overview

# Examples

# Subscription System

Subscribe a listener to **any** state change in the store. This is the integration point with React Apps.

```js
store.subscribe(state => console.log(state))
```

Subscribing to **post** events on a particular **path**:

```js
store.subscribe.post("/users/:userIndex/comments", (comment, params) => {
})
```

Subscribing to **put** events on a particular **path**:

```js
store.subscribe.put("/users/:userIndex/comments/:commentId", (comment, params) => {
})
```

Subscribing to **patch** events on a particular **path**:

```js
store.subscribe.patch("/users/:userIndex/comments/:commentId", (comment, params) => {
})
```

Subscribing to **delete** events on a particular **path**:

```js
store.subscribe.delete("/users/:userIndex/comments/:commentId", (comment, params) => {
})
```

# Contributing

# License
