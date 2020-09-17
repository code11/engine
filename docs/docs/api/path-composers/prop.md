---
id: prop
title: Prop
sidebar_label: Prop
---

`Prop` allow us to refer to props given to the [view](/docs/api/view)s, so that
they can be used to compose paths and operate on state data.

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

In this example, `TodoItem` will have access to `title` of Todo item from state
which has the same id as the `id` prop provided by `TodoItem`'s parent component.
