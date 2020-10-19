---
id: wildcard
title: Wildcard
sidebar_label: Wildcard
---

```ts
import { Wildcard } from "@c11/engine.macro"
```

## Overview
`Wildcard` allow selecting arbitrarily deep paths from state.

They are meant to be used by `producer` to obtain more powerful triggers.

## Example
For example:

```tsx
cons titleWatchProducer: producer = ({
  title = Observe.todos[Wildcard].title
}) => { ... }
```

`titleWatchProducer` will re-run whenever any todo's title changes.

### What changed?

`Wildcard` triggers producer whenever anything on the matching path changes, but
`producer` won't know what exactly has changed. To get information about exactly
what has changed, `Wildcard` can be assigned to another
[Arg](/docs/api/arg), to get information about exactly which path
has received the change. For example,

```tsx
const prod: producer = ({
  id = Wildcard,
  title = Observe.todos[Arg.id].title
}) => { ... }
```

`id` will contain the changed todo's ID.

Assign the `Wildcard` to an `Arg` is also the only way to use `Wildcard` with
`Update` operator. Only `Observe` can make use of `Wildcard` directly in its
path.
