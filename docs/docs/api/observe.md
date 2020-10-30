---
id: observe
title: observe
sidebar_label: observe
---

```ts
import { observe } from "@c11/engine.macro"
```

## Overview

`observe` gives the ability to observe values from global state. To get a "live"
version of a value from Engine's global state, state properties can be directly
accessed from the imported `observe`.

Every use of `observe` in a `view`/`producer`'s header can be thought of as
adding a trigger. Whenever the `observe`d value changes in state, for whatsoever
reason, the view or producer using this value will be re-computed.

## API

### `observe.<path>: any`

If `<path>` is a valid path to an existing property of State, `observe.<path>`
returns value stored at that path in State, otherwise it returns `undefined`. If
the value is serializable (e.g a primitive Javascript type, a plain object), a
copy of the data is returned. However, if the value is not serializable (e.g a
class instance, function etc), a reference to it is returned.

## Example

e.g if the state looks like:

```json
{
  "foo": {
    "bar": "baz"
  }
}
```

value of `bar` can be obtained by assigning `observe.foo.bar` in header of the
[view](/docs/api/view) or [producer](/docs/api/producer). For example,

```
const MyView: view = ({ barVal = observe.foo.bar }) => { ... }
```

Whenever an `observe`d value in state is changed (e.g with
[update](/docs/api/update)), the view or producer using it is re-triggered.
