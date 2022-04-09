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
- only one component per file
- they should have a descriptive name (PascalCase) and the file should have the same name
- they should do only one thing
- components' responsability is to be up to date so the there is no use of `get`
- the use of layout components is highly encourage (cards, sidebars, navbars)
- don't pass down props that contain data that the child component could simply get from the state
- if they have sub-components they can be put in a `./component` folder on the same level
- should contain as little logic as possible.
- they should be used only for **displaying** data or as **layout component** so they shouldn't manipulate or process the data.
- they can only change the state by:
  - triggering a producer (they can even pass simple date to the producers)
  - they can also change the state directly but the changed data should be at most on the same level in the state hierarchy as the component's data is (e.g. checkbox component)
- they can have inline style (tailwind or styled-components) and if they use .css that file should be put in the same folder
- if a component is use in multiple places they should be put in a `generalComponents` upper in the folder hierarchy
- instead of performing any logic in a view, a producer should be created for the view to perform required business logic.
