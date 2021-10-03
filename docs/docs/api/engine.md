---
id: engine
title: engine
sidebar_label: engine
---

Engine application are created by invoking **engine** function:

```ts
const app = engine(config: EngineConfig): EngineInstance
```

## Configuration

The configuration object contains the [initial state](/docs/concepts/state) of
the engine app, and [Engine Modules](/docs/modules/engine) it is going to use.

```ts
type EngineConfig = {
  state?: {
    [key: string]: any;
  };
  use: EngineModule[];
};
```

### `state`

**default:** `{}`

The initial state that will be available to producers and views when the Engine starts.

[Read more about state](/docs/concepts/state)

### `use: EngineModule[]`

An array of Engine modules that the app will start with. These can also be added
later, after the `app` has been created using `app.use`. Engine modules an app
uses make most decisiosn about it. Including how the app is going to be
rendered, e.g as a React app.

[Read more about Engine Modules](/docs/modules/engine)

## Methods

The Engine instance exposes some helpful methods for interacting with the Engine runtime.

### `app.start()`

Start the Engine app, resulting in mounting all the modules currently in use. It
is an idempotent function, i.e it can be called multiple times safely. An engine
module is used only once for an engine instance, until `app.stop()` is called.

### `app.stop()`

Halts pending updates to the state and any other triggering of producers (or
views). An `app.start()` after a call to `app.stop()` will make all the modules
to be mounted again.

### `app.state: { [key: string]: any; }`

Allows patching the application state at runtime. `app.state` takes a new state,
and merges it with existing state.

### `app.use(module: EngineModule): void`

Adds new modules to running Engine app. If Engine app is already started,
`app.use(module)` will do nothing until engine app is stopped and started again.
