---
id: arg
title: arg
sidebar_label: arg
---

```ts
import { arg } from "@c11/engine.macro"
```

## Overview

`arg` allows referring to other arguments in the header of a
[producer](/docs/api/producer) or [view](/docs/api/view). It makes it possible
to treat other keys of the header object as local variables. All of the
following are valid uses of `arg`:

```ts
        const result: producer = ({
          a1 = '123',
          a2 = arg.a1,            // Access previously defined argument
          a3 = arg.b1.b2.b3.b4    // Access nested properties of another arg
          a4 = arg.a2[arg.a1],    // Dynamically access argument properties based on other arg
          a5 = arg.a3[prop.foo],  // Dynamically access argument properties based on other Engine operators
        }) => { }
```

## Example

If we have a `TodoItem` component which accepts a single arg `id: string`, and
global state which looks like:

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
`arg`:

```tsx
const TodoItem: view = ({
  title: observe.todosById[prop.id],
  tags: observe.tagsByTitle[arg.title]
}) => { ... }
```

In this example, `TodoItem` will have access to `tags = ["tag1", "tag2"]`.

`arg` is also very useful with combined with
[wildcard](/docs/api/wildcard)
