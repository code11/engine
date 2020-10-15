---
id: observe
title: Observe
sidebar_label: Observe
---

`Observe` gives the ability to observe values from global state. To get a "live"
version of a value from Engine's global state, state properties can be directly
accessed from the imported `Observe`.

Every use of `Observe` in a `view`/`producer`'s header can be thought of as
adding a trigger. Whenever the `Observe`d value changes in state, for whatsoever
reason, the view or producer using this value will be re-computed.

## Example

e.g if the state looks like:

```json
{
  "foo": {
    "bar": "baz"
  }
}
```

value of `bar` can be obtained by assigning `Observe.foo.bar` in header of the
[view](/docs/api/view) or [producer](/docs/api/producer). For example,

```
const MyView: view = ({ barVal: Observe.foo.bar }) => { ... }
```

Whenever an `Observe`d value in state is changed (e.g with
[Update](/docs/api/update)), the view or producer using it is re-triggered.
