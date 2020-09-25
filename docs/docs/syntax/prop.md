---
id: prop
title: Prop
sidebar_label: Prop
---

`Prop` gives access to props given to the [view](/docs/api/view)s, so that they
can be used as data in the view, and to compose paths for accessing state.

For example, if a `TodoItem` component accepts a single prop `id: string`, and
global state looks like:

```ts
{
  todosById: {
    todo1: { title: "My first todo" }
  }
}
```

It is possible to access `title` for the Todo with a given `id`, by using
`Prop.id` as path. e.g

```tsx
const TodoItem: view = ({
  id, // shortcut for Prop.id
  title: Observe.todosById[Prop.id]
}) => { ... }
```

In this example, when `TodoItem` is used as `<TodoItem id="todo1" />` anywhere
in the application, it will get `My first todo` as value of `title`.
