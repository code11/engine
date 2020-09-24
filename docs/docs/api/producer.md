---
id: producer
title: Producer
sidebar_label: Producer
---

`producer` is the central concept of Engine. Any function can become a producer
by labeling it with `producer`. It allows using Engine features to interact with
the state using [Observe](/docs/api/observe), [Get](/docs/api/get), and
[Update](/docs/api/update).

`Observe`, `Get` and `Update` are used in the first object argument of a
producer function, which is referred to as the "header" of a function. In the
header, Engine operators can be used to interact with state. For example

```tsx
const todoCounter: producer = ({
  todosById: Observe.todosById,
  updateCount = Update.count
}) => (
  const count = Object.keys(todosById).length;

  updateCount.set(count);
);
```

## Running a producer

A `producer` can not be called directly. `producer`s are only ever executed by
Engine when they meet following 2 conditions:

 1. A `producer` must be added to a [view](/docs/api/view)'s `.producers` array,
    or in `Engine`'s global producers list. e.g `myProducer` can added to the
    `Button` view with:

    ```tsx
    Button.producers = [myProducer];
    ```
  2. A `producer` must have at least one trigger. Using
     [Observe](/docs/api/observe) is the only way to add a trigger to a
     `producer`. Whenever an `Observe`d value is changed (e.g using
     [Update](/docs/api/update)), the `producer` is re-executed.

## Best practices

Engine recommends that `producer`s should perform a single job. It is okay to
have many small producers doing one thing each.

## Instance

For debugging pruposes only - Documentation in progress
