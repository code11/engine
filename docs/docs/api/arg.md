---
id: arg
title: Arg
sidebar_label: Arg
---

```ts
import { Arg } from "@c11/engine.macro"
```

## Overview

`Arg` allows referring to other arguments in the header of a
[producer](/docs/api/producer) or [view](/docs/api/view). It makes it possible
to treat other keys of the header object as local variables. All of the
following are valid uses of `Arg`:

```ts
        const result: producer = ({
          a1 = '123',
          a2 = Arg.a1,            // Access previously defined argument
          a3 = Arg.b1.b2.b3.b4    // Access nested properties of another Arg
          a4 = Arg.a2[Arg.a1],    // Dynamically access argument properties based on other Arg
          a5 = Arg.a3[Prop.foo],  // Dynamically access argument properties based on other Engine operators
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
`Arg`:

```tsx
const TodoItem: view = ({
  title: Observe.todosById[Prop.id],
  tags: Observe.tagsByTitle[Arg.title]
}) => { ... }
```

In this example, `TodoItem` will have access to `tags = ["tag1", "tag2"]`.

`Arg` is also very useful with combined with
[Wildcard](/docs/api/wildcard)
