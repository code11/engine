---
id: view
title: view
sidebar_label: view
---

## Overview

`view` creates Engine views, which render HTML in browser and use
operators [observe](/docs/api/observe), [get](/docs/api/get), and
[update](/docs/api/update) to interact with global state.

```tsx
const Button: view = ({
  title,
  count = observe.count,
  updateCount = update.count,
}) => (
  <button onClick={() => updateCount.set((count || 0) + 1)}>
    {title}: {count}
  </button>
);
```

## Adding producers to a view

A `view` can have one or more producers assigned to it:

```tsx
Button.producers([myProducer1, myProducer2]);
```

Producers that belong to a `view` will be activated when the `view` is mounted
and deactivated once the view is unmounted.

These producers will receive all the same props as the view including the special props bellow:

## Special props

Every `view` will receive special props:

- `_viewId` - a string that denotes the view's instance (see next section)
- `_now` - a function used to generate unique timestamps (microsecond)
- `_props` - all the external props received by the component

## Instance

Each view once mounted will have a data representation of that instance accesible on the state e.g.:
`get.views[prop._viewId]`.

```tsx
type viewInstance = {
  id: string,
  createdAt: number,
  data: object, // used to store view's private/temporary data
  parentId: string | null, // the parent view or null if it's the root
  rootId: string, // the root (top-most) view
  children: {
    [k: string]: number // the ids of the direct children views of the view
  }
}
```

## Best practices

View should contain as little logic as possible.

Instead of performing any logic in view, a producer should be created for the
view to perform required business logic.

A `view` is just a specialized form of a [producer](/docs/api/producer). All the
[concepts](/docs/api/producer#parts) and [best
practices](/docs/api/producer#best-practices) of producers apply for views as
well.

