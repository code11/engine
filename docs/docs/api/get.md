---
id: get
title: Get
sidebar_label: Get
---

`Get` give us the ability to get values from our state at a later time since the
`view` or `producer` was triggered. It works the same was as
[Observe](/docs/api/observe), except:
1. `Get` don't provide a value, but instead a function which can be called at
   any time in future to get the value
2. `Get` don't cause `view`s and `producer`s to get triggered.

`Get` is ideal when:
1. We need a value to do a computation in a `producer`, but we don't want the
   producer to get triggered when this value changes
2. We need to retrieve a value at a reasonably later time since producer was
   triggered, e.g while performing an asynchronous operation

e.g if our state looks like:

```json
{
  "foo": {
    "bar": "baz"
  }
}
```

We can access the value of `bar` by assigning `Get.foo.bar` in destructed
arguments of a [view](/docs/api/view) or [producer](/docs/api/producer), and
calling it later e.g

```
const doSomeWork: producer = ({ getBar: Get.foo.bar }) => {
  const var = getBar(); // provides lates value of bar, and does not trigger if bar ever changes
}
```

Whenever an `Get`d value in state is changed (e.g with
[Update](/docs/api/update)), the view or producer using it is re-triggered.
