---
id: engine
title: Engine Modules
sidebar_label: Engine Modules
---

Engine is written in an extremely modular manner. Most critical components of
Engine are written as modules, and need to be added to an engine app using
either `use` attribute of [Engine Configuration](/docs/api/engine), or using
`engineApp.use` function after creation of [Engine
app](/docs/api/engine#use-enginemodule).

Modules are also responsible for how the application will produce its output,
for example, as a React application.

```ts
type EngineModule = {
  bootstrap?: () => void | Promise<void>;
  mount: (context: ModuleContext) => void | Promise<void>;
  unmount: (context: ModuleContext) => void | Promise<void>;
};
```
### `bootstrap: () => void | Promise<void>`

`bootstrap` function gets called when the engine instance itself is bootstrapping.

### `mount: (context: ModuleContext) => void | Promise<void>`

`mount` gets called as the engine instance starts. This function receives
`context` object, which can be used to add or remove
[producers](/docs/api/producer) from the Engine app.

### `unmount: (context: ModuleContext) => void | Promise<void>`

Same as `mount`, `unmount` gets called as Engine app is un-mounting.
