---
id: engine
title: Engine
sidebar_label: Engine
---

`Engine` class is platform dependent part of the Engine framework. Every Engine app starts with a new instance of `Engine` class, which accepts different arguments depending on the platform.

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

1. `view`

  Engine React likes to take full control of the application, including how the
  application is mounted no DOM. We accepts:

    - A root react `element` which will be mounted to DOM
    - A query-selector on which the `element` will be mounted

2. `state`

  Engine, like Redux, keeps a global state. This global state can be very simply
  defined by providing a plain object to `Engine`'s `state` option.

    - `state.initial` becomes the initial state for our application. To get the
      magic macros like [Observe](/docs/api/observe) to work, our state state
      has to be an object.
