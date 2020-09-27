---
id: best-practices
title: Best Practices
sidebar_label: Best Practices
---

### Use Global state as a single source of truth

An instance of [Engine](/docs/implementations/introduction) can have a single
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

### Prefer explicit types over boolean flags

Instead of using boolean flags, e.g `isDone` and `isEditing`, prefer using
explicit types, e.g

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

When using an `Enum`, prefer using a string Enum.
