---
id: param
title: param
sidebar_label: param
---

## Overview

`param` allow using runtime values from the view/producer to create new paths.

Occasionally, a `producer` or `view` need to access a path in state, which
depends on a value which is created in the producer itself. `param` is the
[path-composition](/docs/concepts/path-composition) operator to use in such
situations.

For example, `update.*` functions can be given an object in their second
argument. Every key in this object can then be referred to with `param.<key>` in
the header

## Example

```tsx
const App: view = ({
  update = update.items[param.foo][param.bar]
}) => (
  <input onChange={e => update(e.target.value,
    { foo: 'state_path', bar: 'yet_another_state_path' }
  )}>
);
```

It allows moving a lot of complexity of accessing and setting of state, to the
path structure; without needing any intermediate state in the view/producer
itself.
