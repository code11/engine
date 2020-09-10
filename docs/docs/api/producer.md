---
id: producer
title: producer
sidebar_label: producer
---

`producer` is the central concept of Engine. We can label any function as a
`producer`. It allows us to use Engine features to interact with our state using
[Observe](/docs/api/observe), [Get](/docs/api/get), and
[Update](/docs/api/update).

`Observe`, `Get` and `Update` are used in the first object argument of a
producer function. We sometimes refer to this first object argument as the
"header" of a function. In the header, we can use Engine utilities to interact
with state. e.g

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

A `producer` can not be executed directly in any way. `producer`s are only ever
 executed by the Engine when they meet the 2 conditions:

 1. A `producer` must be added to a [view](/docs/api/view)'s `.producers` array,
    or it must be added in `Engine`'s global producers list. e.g if we have a
    `myProducer` [producer](/docs/api/producer), we can add it to our `Button`
    view with:

    ```tsx
    Button.producers = [myProducer];
    ```
  2. A `producer` must have at least one trigger. Using
     [Observe](/docs/api/observe) is the only way to add a trigger to a
     `producer`. Whenever an `Observe`d value is changed (e.g using
     [Update](/docs/api/update)), the `producer` is re-executed.

## Best practices

Engine recommends that our `producer`s should perform a single job. It is okay
to have many small producers doing one thing each.
