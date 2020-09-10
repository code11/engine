---
id: observe
title: Observe
sidebar_label: Observe
---

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

We can access the value of `bar` by assigning `Observe.foo.bar` in destructed
arguments of a [view](/docs/api/view) or [producer](/docs/api/producer). e.g

```
const MyView: view = ({ barVal: Observe.foo.bar }) => { ... }
```

Whenever an `Observe`d value in state is changed (e.g with
[Update](/docs/api/update)), the view or producer using it is re-triggered.
