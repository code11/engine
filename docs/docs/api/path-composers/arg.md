---
id: arg
title: Arg
sidebar_label: Arg
---

`Arg` allows referring to other arguments in header of a
[producer](/docs/api/producer) or [view](/docs/api/view).

For example, given a `TodoItem` component which accepts a single arg `id:
string`, and global state which looks like:

```ts
{
  todosById: {
    todo1: { title: "My first todo" }
  },
  tagsByTitle: {
    "My first todo": ["tag1", "tag2"]
  }
}
```

It is possible to access tags for the Todo with `id`, by composing path using
`Arg`:

```tsx
const TodoItem: view = ({
  title: Observe.todosById[Prop.id],
  tags: Observe.tagsByTitle[Arg.title]
}) => { ... }
```

In this example, `TodoItem` will have access to `tags = ["tag1", "tag2"]`.

`Arg` is also very useful with combined with
[Wildcard](/docs/api/path-composers/wildcard)
