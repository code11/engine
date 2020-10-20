---
id: update
title: Update
sidebar_label: Update
---

```ts
import { Update } from "@c11/engine.macro"
```

## Overview
`Update` provides the ability to update values in the global state. `Update` is
the dual of `Observe`. [Observe](/docs/api/observe) enables reading live values
from state, `Update` allows changing values in state.

## API

`Update.<path>` returns an object with following properties:

1. `.set(val: any, newParams?: object)` to replace the value of `<path>` in
   state, or create it if it doesn't exist yet. `newParams` is an optional
   object argument, the keys of which set the [Param](/docs/api/param)s.
2. `.merge(val: any)` accepts an object, and merge it with existing object value
   of `<path>` in state
3. `.remove()` removes the `<path>` from state

## Example

If the state looks like:

```json
{
  "foo": {
    "bar": "baz"
  }
}
```

Operations to change the value of `bar` can be obtained by assigning
`Update.foo.bar` in the header of a [view](/docs/api/view). e.g

```
const MyComponent = ({ bar: Update.foo.bar }) => {
  bar.set('qux');
  ...
}
```
