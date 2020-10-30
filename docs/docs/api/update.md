---
id: update
title: update
sidebar_label: update
---

```ts
import { update } from "@c11/engine.macro"
```

## Overview
`update` provides the ability to update values in the global state. `update` is
the dual of `observe`. [observe](/docs/api/observe) enables reading live values
from state, `update` allows changing values in state.

## API

`update.<path>` returns an object with following properties:

1. `.set(val: any, newParams?: object)` to replace the value of `<path>` in
   state, or create it if it doesn't exist yet. `newParams` is an optional
   object argument, the keys of which set the [param](/docs/api/param)s.
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
`update.foo.bar` in the header of a [view](/docs/api/view). e.g

```ts
const MyComponent: producer = ({ bar = update.foo.bar }) => {
  bar.set('qux');
  ...
}
```
