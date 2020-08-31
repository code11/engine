---
id: update
title: Update
sidebar_label: Update
---

`Update` is a babel-macro provided by `@c11/engine.macro` package.

`Update` give us the ability to update values in our state. `Update` is the
complement of `Observe`. [Observe](/docs/api/observe) enable us to read values
from state, `Update` allow us to change the.

e.g if our state looks like:

```json
{
  "foo": {
    "bar": "baz"
  }
}
```

We can get a function to change the value of `bar` using by assigning
`Update.foo.bar` in destructed arguments of a [view](/docs/api/view). e.g

```
const MyComponent = ({ setBar: Update.foo.bar }) => {
  setBar('qux');
  ...
}
```
