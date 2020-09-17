---
id: update
title: Update
sidebar_label: Update
---

`Update` provides the ability to update values in the global state. `Update` is
the dual of `Observe`. [Observe](/docs/api/observe) enables reading live values
from state, `Update` allows changing values in state.

e.g if the state looks like:

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

`Update.<path>` returns an object with following properties:

1. `.set(val: any)` to replace the value of `<path>` in state, or create it if it
   doesn't exist yet.
2. `.merge(val: any)` accepts an object, and merge it with existing object value
   of `<path>` in state
3. `.remove()` removes the `<path>` from state
