---
id: path-composition
title: Path Composition
sidebar_label: Path Composition
---

"Path" is the location of a property in state. e.g if the state looks like:

```js
const State = {
  foo: {
    bar: {
      baz: "BAZZZ!"
    }
  }
}
```

Then path for `baz` is `.foo.bar.baz`.

Path composition is creating new paths by combining smaller paths. It sounds
simple, because it is. It is also one of the most important (and occasionally
confusing) aspects of building applications with Engine.

Conceptually, Paths can be static or dynamic. A path can be considered static
when you know exactly where the data you're interested in is. e.g `.foo.bar.baz`
in example above.

A path is dynamic when its exact location is known at runtime, and is calculated
at runtime depending on runtime values like props given to the view, data from
the state (e.g. an might store a `selectedId` in state), or local variables.

Engine provides following path composition operators for creating paths, and
composing them together:

1. [Prop](/docs/api/prop)
2. [Arg](/docs/api/arg)
3. [Param](/docs/api/param)
4. [Wildcard](/docs/api/wildcard)
5. [Path](/docs/api/path)

Paths composed using these operators can be used with all 3 state manipulation
operators i.e with [Observe](/docs/api/observe), [Get](/docs/api/get) and
[Update](/docs/api/update)

All Engine path composition operators ([Arg](/docs/api/arg),
[Get](/docs/api/get), [Prop](/docs/api/prop), [Param](/docs/api/param),
[Update](/docs/api/update), [Observe](/docs/api/observe)) can be given any
arbitrarily nested path (e.g `Arg.b1.b2.b3`) regardless of whether the given
path exists in state or not. Engine won't throw an error if an invalid path is
given to these operators.
