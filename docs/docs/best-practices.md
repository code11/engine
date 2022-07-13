---
id: best-practices
title: Best Practices
sidebar_label: Best Practices
---

### Use Global state as a single source of truth

An instance of [Engine](/docs/api/engine) can have a single
global state, and it is recommended to use that as the single source of truth
for all the data required by all components of an application.

### Keep a normalized state

Same data should not be kept in more than one paths in state.

### Pass minimal data to children

Parent component should pass minimum amount of data to its children. Ideally, no
data should be passed to a component's children. Children are responsible for
observing the data they need from global state.

### Component which needs the data, maintains the data

When different components need same data in different shapes, e.g `TodoFooter`
needs a to show number of pending `TodoItem`s, it is the responsibility of
`TodoFooter` to have a producer which provides `pendingCount` by counting
`TodoItem.status === 'pending'` from state.

### Use Object to store domain objects instead of Array

Domain objects are the critical business objects we have modeled to solve the
business problems with our software. It is recommended to keep domain objects in
`Object` e.g `todosById: { [id: string]: TodoItem }`.

This is a good practice in general, and Engine provides nice optimizations for
this pattern. When a list of such objects is needed, a producer should be
created to create and update a list of `id`s.

### Prefer explicit types for defining states

When using an `Enum`, prefer using a string Enum.

```ts
enum Statuses {
  done: "done",
  pending: "pending"
}

enum Modes {
  viewing: "viewing",
  editing: "editing"
}
```

### Convention for naming variables:

- `observe`: the final name in the path or an interpretation of that value:

```ts
bam = observe.something.bam;
title = observe.article.title;
isFinished = observe.article.finishedWritingInArticle;
```

- `update`: the prefix update + the final name in the path or an interpretation of that value:

```ts
updateBam = update.something.bam;
updateTitle = update.article.title;
updateIsFinished = update.article.finishedWritingInArticle;
```

- `get`: the prefix get + the final name in the path or an interpretation of that value:

```ts
getBam = get.something.bam;
getTitle = get.article.title;
getIsFinished = get.article.finishedWritingInArticle;
```

- `_` for pseudo-private props:

```ts
_viewId;
_producerId;
_now;
```

### Producers:

- a `producer` should perform a single, very specific job.
  The more specific the better. It is okay to have many small producers doing one thing each.
- only one producer per file
- should have a descriptive name (camelCase) and the file should have the same name
- should use `get` instead of `observe` if you don’t need that value to retrigger the producer
- in the folder structure they should stay close to the components that use them.
- use a barrel file to export multiple producers together
- all the dependencies of a producers should be passed in the header.
  The following is encouraged to increase the testability and reusability of the producer:
  ```ts
  import axios from 'axios'
  const something: producer = ({
    _axios = axios,
    url = observe.data.url
    ...
  }) => {
    _axios.get(url)
  }
  ```

### Views:

- if you do not interact with the state you don't need a view, use a regular component instead
- views = rendering, move logic to producers and communicate through the state
- use `observe` to ensure that views are up-to-date visual representation of the state
- never use `get` in the rendering process
- only use `get` to get data needed in async situations e.g. `onClick`
- pass minimum information to child components e.g. an `id` is enough for the child to then create paths for the information it needs
- record the intents of the user and not the meaning of the intent e.g. this thing was clicked vs remove the entity and refresh the data
