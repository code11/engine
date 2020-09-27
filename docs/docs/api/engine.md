---
id: engine
title: Engine
sidebar_label: Engine
---

Every Engine application starts by creating a new **Engine instance** with the `Engine` function:

```ts
const engine = new Engine(config: EngineConfig): EngineInstance
```

## Configuration

The configuration object contains the application structure and runtime setttings.

```ts
type EngineConfig = {
  autostart?: boolean;
  producers?:  Producer[];
  render?: {
    element: HTMLElement | View;
    container: string | HTMLElement | Promise | Function;
  }
  state?: {
    [key: string]: any;
  };
  debug?: boolean;
}
```

### `autostart`
**default:** `boolean = true`

When the `Engine` starts, it will instantiate producers and attempt to mount the view.

If `false`, any activity will be delayed until the [`start`](#enginestart) method is called on the Engine instance

### `producers`

**default:** `[]`

An array of producers that will be instantiated when the Engine starts.

[Read more about producers](/docs/api/producer)

### `render`
**default:** `undefined`

Available only in Engine implementations that support rendering.

#### `element`

The element that will be rendered in the container. Accepts one of:

* `HTMLElement` - an HTML element that will be inserted in the container
* `View` - an Engine View ([read more](/docs/api/view))

#### `container`

The mounting point for the `element`. Accepts one of:

* `string` - a CSS selector (the first matched element will be used)
* `HTMLElement` - an HTML element that will be used a
* `Promise` - should return an `HTMLElement`
* `Function` - can return an `HTMLElement` or a `Promise`

### `state`
**default:** `{}`

The initial state that will be available to producers and views when the Engine starts.

[Read more about state](/docs/concepts/state)

### `debug`
**default:**: `false`

Trigger the engine to run in debug more. This will record all state transitions, producers and views trigger and update history and more.

[Read more about debugging](/docs/guides/debugging)

## Methods

The Engine instance exposes some helpful methods for interacting with the Engine runtime.

### `engine.context`

Allows you to have access to the internal instances

| Property | Description | Type |
|-|-|-|
| db | The internal database which stores the application state and triggers updates | EngineDbInstance |
| producers | A list of instantiated producers | [`ProducerInstance`](/docs/api/producer#instance)[] |
| views | A list instantiated views | [`ViewInstance`](/docs/api/view#instance)[] |
| container | The used container for mounting the application | HTMLElement |

### `engine.status`

The current status of the Engine instance:

| Status | Description |
|-|-|
| `RUNNING` | The Engine is running, producers are triggered, etc. |
| `STOPPED` | No state transitions, no producers are trigger, etc |
| `NOT_INITIALIZED` | No producer or view have been mounted. No state transition was made. |

### `engine.start()`

Start the Engine.

Will act differently depending on the current Engine status:

| Status | Action |
|-|-|
| `NOT_INITIALITAZED` | Instantiate producers and if available, trigger the mounting of the application |
| `STOPEED` | Resume the triggering of producers (and views) and apply pending updates |
| `RUNNING` | Nothing, the Engine is already running |

### `engine.stop()`

Halts pending updates to the state and any other triggering of producers (or views).
