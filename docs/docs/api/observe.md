---
id: observe
title: Observe
sidebar_label: Observe
---

`Observe` is a babel-macro provided by `@c11/engine.macro` package.

`Observe` give us the ability to observe values from our state. To get a "live"
version of a value from Engine's global state, we can access the state
properties directly from `Observe` import.

e.g if our state looks like:

```json
{
  "foo": {
    "bar": "baz"
  }
}
```

We can access the value of `bar` using by assigning `Observe.foo.bar` in
destructed arguments of a [view](/docs/api/view). e.g

```
const MyComponent = ({ barVal: Observe.foo.bar }) => { ... }
```
