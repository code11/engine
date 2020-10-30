---
id: prop
title: prop
sidebar_label: prop
---

```ts
import { prop } from "@c11/engine.macro"
```

## Overview

`prop` gives access to props given to the [view](/docs/api/view)s, so that they
can be used as data in the view, and to [compose
paths](/docs/concepts/path-composition) for accessing state. `prop` can also be
used in [producer](/docs/api/producer)s, in which case they pass the `prop`s
received by the corresponding view.

## Example

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
`prop.id` as path. e.g

```tsx
const TodoItem: view = ({
  id, // shortcut for prop.id
  title = observe.todosById[prop.id]
}) => { ... }
```

In this example, when `TodoItem` is used as `<TodoItem id="todo1" />` anywhere
in the application, it will get `My first todo` as value of `title`.
