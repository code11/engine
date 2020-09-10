---
id: arg
title: Arg
sidebar_label: Arg
---

`Arg` allow us to refer to other arguments of the same
[producer](/docs/api/producer) or [view](/docs/api/view).

For example, if we have a `TodoItem` component which accepts a single arg `id:
string`, and a state which looks like:

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

We can access tags for the Todo with `id`, by composing our path using `Arg`:

```tsx
const TodoItem: view = ({
  title: Observe.todosById[Prop.id],
  tags: Observe.tagsByTitle[Arg.title]
}) => { ... }
```

In this example, `TodoItem` will have access to `tags = ["tag1", "tag2"]`.

`Arg` is also very useful with combined with
[Wildcard](/docs/api/path-composers/wildcard)
