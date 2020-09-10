---
id: engine
title: Engine
sidebar_label: Engine
---

`Engine` class is platform dependent part of the Engine framework. Every Engine
app starts with a new instance of `Engine` class, which accepts different
arguments depending on the platform.

## React

In case of React, an `Engine` instance looks like:

```ts
const engine = new Engine({
  state: {
    initial: {}
  },
  view: {
    element: <App />,
    root: "#root"
  }
});

engine.start();
```

### Arguments

React Engine accepts a single object as an argument. This object can have
following properties:

1. `view`

  Engine React likes to take full control of the application, including how the
  application is mounted to DOM. It accepts:

    - `view.element`: A root react `element` which will be mounted to DOM
    - `view.root`: A query-selector on which the `element` will be mounted. It can also be a
        1. DOM node, a function which returns a DOM node
        2. function which returns a DOM node
        3. promise to a DOM node
        4. function which returns a promise to a DOM node

2. `state`

  Engine, like Redux, keeps a global state. This global state can be very simply
  defined by providing a plain object to `Engine`'s `state` option.

    - `state.initial` becomes the initial state for our application. To get the
      magic macros like [Observe](/docs/api/observe) to work, our state state
      has to be an object.

### Engine instance

The Engine instance obtained with `engine = new Engine({ ... })` has following methods on it:

1. `engine.start`

  It starts the engine instance. It is required to be called for engine to start
  performing its work.
