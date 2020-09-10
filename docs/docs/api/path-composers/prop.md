---
id: prop
title: Prop
sidebar_label: Prop
---

`Prop` allow us to refer to [React
props](https://reactjs.org/docs/components-and-props.html) in our
[view](/docs/api/view)s, so we can dynamically `Observe` state data. `Prop` are
usually `String`s provided by a parent Component in a React app.

For example, if we have a `TodoItem` component which accepts a single prop `id:
string`, and a state which looks like:

```ts
{
  todosById: {
    todo1: { title: "My first todo" }
  }
}
```

We can access `title` for the Todo with `id`, by using `Prop.id` as path. e.g

```tsx
const TodoItem: view = ({
  id, // a shortcut for Prop.id
  title: Observe.todosById[Prop.id]
}) => { ... }
```

In this example, `TodoItem` will have access to `title` of Todo item from state
which has the same id as the `id` prop provided by `TodoItem`'s parent component.
