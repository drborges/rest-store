# rest-store

State management made with ❤️.

# Components

Mutator = ArrayMutator | ObjectMutator | ValueMutator
MutationPath = Path

```js
@Mutator
class Store<T> {
  constructor(initialState: T) {
    this.state = initialState
  }
}

type MyState = {
  users: User[],
  network: {
    activity: "idle" | "busy",
    retries: number,
  },
}

const store = new reflux.Store<MyState>({
  users: [{ name: "diego" }],
  network: {
    activity: "idle",
    retries: 3,
  }
})

store.subscribe((state, event) => event.path; event.action)
store.catch((error, event) => )

try {
  const user = await store.state.users.push({ name: "bianca" })
  const response = await api.users.create(user)
  if (response.status !== 201) {
    throw new Error(response.message)
  }
} catch(e) {
  store.state.users.delete(user)
}

// => notifies subscribers
store.state.users[0].name = "borges"
// => notifies subscribers
store.state.users.push(api.users.create({ name: "ronaldo" }))
// => notifies subscribers
```

```js
class Store {}

const store = new Store({
  users: [
    { name: "Diego" },
    { name: "Bianca" },
  ]
})

const diego = store.state.users[0]
// => new ObjectMutator(store, new Path("users", "0"))

const users = store.state.users
// => new ArrayMutator(store, new Path("users", "0"))

diego.name = "Diego Borges"
// => triggers store mutation at /users/0/name
```

```js
class Subscription {}

const subscription = new Subscription(new Path("users", ".", "comments", "0"), subscriber)

subscription.accept(new Path("users", "1", "comments", "0"))
// => true

subscription.accept(new Path("users", "1", "comments", "1"))
// => false

subscription.notify(data)
// => subscriber(data)
```

```js
@Cached
class Path {}

const path = new Path("users", "0", "comments")
path.match(new Path("users", "0", "comments"))
// => true
path.match(new Path("users", ".", "comments"))
// => true
path.match(new Path("users", "1", "comments"))
// => false
path.next("1")
// => new Path("users", "0", "comments", "1")
path.parent()
// => new Path("users", "0", "comments")

const store = {
  users: [
    { name: "diego", comments: [{ text: "LoL" }]}
  ]
}

path.walk(store)
// => [{ text: "LoL" }]
```

```js
@Abstract
class Mutator {}
```

```js
@CachedPath
@ObjectProxy
class ValueMutator extends Mutator {}

const name = new ObjectMutator(store, new Path("users", "0", "name"))

name.get()
// => "Diego"

name.set("Diego Borges")
// => {
//   users: [
//     { name: "Diego Borges" },
//     { name: "Bianca" },
//   ]
// }
```

```js
@ObjectProxy
@CachedMutator
class ObjectMutator extends Mutator {}

const diego = new ObjectMutator(store, new Path("users", "0"))
diego.get()
// => { name: "Diego" }

diego.name.get()
// => "Diego"

// causes a mutation to the path /users/0/name, yielding a new state but keeping all paths not affected by this mutation:
diego.name = "Diego Borges"
// => {
//   users: [
//     { name: "Diego Borges" },
//     { name: "Bianca" },
//   ]
// }
```

```js
@ArrayProxy
@CachedMutator
class ArrayMutator extends Mutator {}

const users = new ArrayMutator(store, new Path("users"))

users.get()
// => [
//      { name: "Diego" },
//      { name: "Bianca" },
//    ]

// causes a mutation to the path /users
users.push({ name: "Hernando" })
// => [
//      { name: "Diego" },
//      { name: "Bianca" },
//      { name: "Hernando" },
//    ]

// causes a mutation to the path /users
users.remove(0)
// => [
//      { name: "Bianca" },
//      { name: "Hernando" },
//    ]
```
