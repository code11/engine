---
id: wildcard
title: wildcard
sidebar_label: wildcard
---

```ts
import { wildcard } from "@c11/engine.runtime";
```

## Overview

`wildcard` allow selecting arbitrarily deep paths from state.

They are meant to be used by `producer` to obtain more powerful triggers.

## Example

For example:

```tsx
cons titleWatchProducer: producer = ({
  title = observe.todos[wildcard].title
}) => { ... }
```

`titleWatchProducer` will re-run whenever any todo's title changes.

### What changed?

`wildcard` triggers producer whenever anything on the matching path changes, but
`producer` won't know what exactly has changed. To get information about exactly
what has changed, `wildcard` can be assigned to another
[arg](/docs/api/arg), to get information about exactly which path
has received the change. For example,

```tsx
const prod: producer = ({
  id = wildcard,
  title = observe.todos[arg.id].title
}) => { ... }
```

`id` will contain the changed todo's ID.

Assign the `wildcard` to an `arg` is also the only way to use `wildcard` with
`update` operator. Only `observe` can make use of `wildcard` directly in its
path.
