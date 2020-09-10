---
id: view
title: view
sidebar_label: view
---

`view` is for labeling React components. It allows us to use Engine features to
interact with our state using [Observe](/docs/api/observe),
[Get](/docs/api/get), and [Update](/docs/api/update).

`Observe`, `Get` and `Update` are used in the first object argument of a
function. We sometimes refer to this first object argument as the "header" of a
function. e.g if we have a react component that looks like:

```tsx
const Button = ({ title }) => (<button>{title}</button>);
```

we can convert it to an Engine view by labeling it with `view`:

```tsx
const Button: view = ({ title }) => (<button>{title}</button>);
```

No other change is required. Except the header part of the function, rest of it
is a normal React component. In the header, we can use Engine utilities to
interact with state. e.g

```tsx
const Button: view = ({
  title,
  count = Observe.count,
  updateCount = Update.count
}) => (
  <button
    onClick={() => updateCount((count || 0) + 1)}
  >{title}: {count}
  </button>
);
```

## `view.producers`

A `view` can have one or more producers assigned to it as an array. e.g if we
have a `myProducer` [producer](/docs/api/producer), we can add it to our
`Button` view with:

```tsx
Button.producers = [myProducer];
```

PS `view`s are just specialized [producer](/docs/api/producer)s. Only difference
between a view and a producer is that a view can:
1. Return JSX and act as a React component
2. Have `.producers` property

## Best practices

Engine recommends that our `view`s should contain as little logic as possible.
Ideally, a view should be completely free from all forms of logic. Instead of
performing any logic in view, create a producer for the view which performs
required logic, and store the results in the state, which can then be utilized
by the view.
