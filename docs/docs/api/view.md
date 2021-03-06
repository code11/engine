---
id: view
title: view
sidebar_label: view
---

## Overview
`view` creates Engine views, which render HTML in browser. `view` can use Engine
operators [observe](/docs/api/observe), [get](/docs/api/get), and
[update](/docs/api/update) to interact with global state.

`observe`, `get` and `update` are used in the first object argument of a
function, also called "header" of the function.

A `view` is just a specialized form of a [producer](/docs/api/producer). All the
[concepts](/docs/api/producer#parts) and [best
practices](/docs/api/producer#best-practices) of producers apply for views as
well.

## Example

For example, a react component that looks like:

```tsx
const Button = ({ title }) => (<button>{title}</button>);
```

can be converted to an Engine view by labeling it with `view`:

```tsx
const Button: view = ({ title }) => (<button>{title}</button>);
```

No other change is required. Except the header part of the function, rest of it
is a normal React component. In the header, Engine operators can be used to
interact with state. For example:

```tsx
const Button: view = ({
  title,
  count = observe.count,
  updateCount = update.count
}) => (
  <button
    onClick={() => updateCount((count || 0) + 1)}
  >{title}: {count}
  </button>
);
```

## `view.producers`

A `view` can have one or more producers assigned to it as an array. e.g a
producer named `myProducer` [producer](/docs/api/producer) can be added to
`Button` view with:

```tsx
Button.producers = [myProducer];
```

`view`s are just specialized [producer](/docs/api/producer)s. Only difference
between a view and a producer is that a view can:
1. Return JSX which gets rendered as HTML in browser
2. Have `.producers` property

## Best practices

Engine recommends that `view`s should contain as little logic as possible.
Ideally, a view should be completely free from all forms of logic, but can
contain minimal amount of logic needed to provide a clean API.

Instead of performing any logic in view, a producer should be created for the
view to perform required business logic.

## Instance

For debugging pruposes only - Documentation in progress
