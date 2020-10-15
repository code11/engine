---
id: get
title: Get
sidebar_label: Get
---

`Get` provides the ability to get values from the global state at a later time
after the `view` or `producer` was triggered. It works the same way as
[Observe](/docs/api/observe), except:
1. `Get` don't provide a value, but instead a function which can be called at
   any time in future to get the latest value form state
2. `Get` don't cause `view`s and `producer`s to get triggered

`Get` is ideal when:
1. A value is needed to do a computation in a `producer`, but the producer
   should not get triggered when this value changes
2. A value is needed at a later time since producer was triggered, e.g while
   performing an asynchronous operation

## Example

For example, if the state looks like:

```json
{
  "foo": {
    "bar": "baz"
  }
}
```

The value of `bar` can be accessed by assigning `Get.foo.bar` in header of a
[view](/docs/api/view) or [producer](/docs/api/producer), and calling it later
e.g

```
const doSomeWork: producer = ({ getBar: Get.foo.bar }) => {
  const var = getBar(); // provides lates value of bar, and does not trigger if bar ever changes
}
```

Whenever a value accessed with `Get` in state is changed (e.g with
[Update](/docs/api/update)), the view or producer using it is **not** re-triggered.
