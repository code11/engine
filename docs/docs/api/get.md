---
id: get
title: get
sidebar_label: get
---

```ts
import { get } from "@c11/engine.macro"
```

## Overview

`get` provides the ability to get values from the global state at a later time,
after the `view` or `producer` was triggered. It works the same way as
[observe](/docs/api/observe), except:
1. `get` don't provide a value, but instead an api for that path which can be used at
   any time in future to get the latest value form state
2. `get` don't cause `view`s and `producer`s to get triggered

`get` is ideal when:
1. A value is needed to do a computation in a `producer`, but the producer
   should not get triggered when this value changes
2. A value is needed at a later time since producer was triggered, e.g while
   performing an asynchronous operation

## API

`get.<path>` returns an object with following properties:

1. `.value(params?: object)` returns the date stored at that `<path>`
   `params` is an optional object argument, the keys of which set the
   [param](/docs/api/param)s.
2. `.includes(value: any, params?: object)` if the value at the given
   `<path>` is an array or a string, it returns a boolean if the provided
   `value` exists at that `<path>`
3. `.length(params?: object)` if the value at the given `<path>` is an `array`,a `string`, or a `function` it returns the length property

For the `value` getter method, if the stored data is serializable (e.g a primitive
Javascript type, a plain object), a copy of the data is returned. However, if
the data is not serializable (e.g a class instance, function etc), a reference
to it is returned.

## Example

For example, if the state looks like:

```json
{
  "foo": {
    "bar": "baz"
  }
}
```

The value of `bar` can be accessed by assigning `get.foo.bar` in header of a
[view](/docs/api/view) or [producer](/docs/api/producer), and calling it later
e.g

```
const doSomeWork: producer = ({ getBar = get.foo.bar }) => {
  const var = getBar.value(); // provides lates value of bar, and does not trigger if bar ever changes
}
```

Whenever a value accessed with `get` in state is changed (e.g with
[update](/docs/api/update)), the view or producer using it is **not** re-triggered.
