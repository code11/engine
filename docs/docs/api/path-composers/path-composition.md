---
id: path-composition
title: Path Composition
sidebar_label: Path Composition
---

Engine apps rely heavily on path composition. "Path" refers to the location of a
property in the global state object. e.g if the state looks like:

```js
{
  foo: {
    bar: {
      baz: "BAZZZ!"
    }
  }
}
```

Then path for `baz` is `.foo.bar.baz`.

Path composition is the act of creating paths to access values from state. It
sounds simple, because it is. It is also one of the most important (and
occasionally confusing) aspect of building applications with Engine.

Engine provides following utilities for composing paths to work on:

1. [Prop](/docs/api/path-composers/prop)
2. [Arg](/docs/api/path-composers/arg)
3. [Param](/docs/api/path-composers/param)
4. [Wildcard](/docs/api/path-composers/wildcard)
5. [Path](/docs/api/path-composers/path)

Paths composed using these path composition utilities can be used with all 3
state manipulation operators provided by Engine i.e with
[Observe](/docs/api/observe), [Get](/docs/api/get) and
[Update](/docs/api/update)
