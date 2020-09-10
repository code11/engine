---
id: update
title: Update
sidebar_label: Update
---

`Update` give us the ability to update values in our state. `Update` is the dual
of `Observe`. [Observe](/docs/api/observe) enable us to read live values from
state, `Update` allow us to change values in state.

e.g if our state looks like:

```json
{
  "foo": {
    "bar": "baz"
  }
}
```

We can get operations to change the value of `bar` by assigning `Update.foo.bar`
in destructed arguments of a [view](/docs/api/view). e.g

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
