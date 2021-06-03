---
id: update
title: update
sidebar_label: update
---

## Overview
`update` provides the ability to update values in the global state. `update` is
the dual of `observe`. [observe](/docs/api/observe) enables reading live values
from state, `update` allows changing values in state.

## API

`update.<path>` returns an object with following properties:

1. `.set(value: any, params?: object)` to replace the value of `<path>` in
   state, or create it if it doesn't exist yet. `params` is an optional
   object argument, the keys of which set the [param](/docs/api/param)s.
2. `.merge(value: any, params?: object)` accepts an object, and merge it with existing object value
   of `<path>` in state
3. `.remove(params?: object)` removes the `<path>` from state
4. `.push(value: any, params?: object)` if the value at the given `<path>` is an array, then the value will be appened to the array
5. `.pop(params?: object)` if the value at the given `<path>` is an array, then the last element will be removed

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
