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
1. `get` don't provide a value, but instead a function which can be called at
   any time in future to get the latest value form state
2. `get` don't cause `view`s and `producer`s to get triggered

`get` is ideal when:
1. A value is needed to do a computation in a `producer`, but the producer
   should not get triggered when this value changes
2. A value is needed at a later time since producer was triggered, e.g while
   performing an asynchronous operation

## API

### `get.<path>: (newParams?: object) => any`

A call to `get.<path>` (where `<path>` is a path to any data in state) returns a
getter function.

Calling this function returns the data stored in that path, or `undefined` (for
non-existent path). If the stored data is serializable (e.g a primitive
Javascript type, a plain object), a copy of the data is returned. However, if
the data is not serializable (e.g a class instance, function etc), a reference
to it is returned.

The getter function also receives an optional argument of type `Object`. The
keys of this object set the [param](/docs/api/param)s.

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
  const var = getBar(); // provides lates value of bar, and does not trigger if bar ever changes
}
```

Whenever a value accessed with `get` in state is changed (e.g with
[update](/docs/api/update)), the view or producer using it is **not** re-triggered.
