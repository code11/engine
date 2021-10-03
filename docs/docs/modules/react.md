---
id: react
title: React Module
sidebar_label: React Module
---

```ts
import { render } from "@c11/engine.react";
```

React module for engine allow running Engine applications on React. Like any
other Engine module, to run the application on React,
[EngineConfig.use](/docs/api/engine#use-enginemodule) or
[engineInstance.use](/docs/api/engine#appusemodule-enginemodule-void) should be
used to add the react module.

For example,

```ts
import { engine } from '@c11/engine';
import { render } from '@c11/engine.react';
import App './views/App';

const app = engine({
  state: {},
  use: [
    render({
      <App />,
      '#root'
    });
  ]
});
```

Above snippet will render an engine [view](/docs/api/view) named `App` in HTML
element with id `root`.

## `render({ view: any, container: any}): EngineModule`

`render` function accepts a [view](/docs/api/view) as its first argument.
Its second polymorphic argument is used as the location in the DOM tree where
the `view` will be mounted. It can be:

1. `String` which is treated as a [query
   selector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)
2. `Function` which should return an HTMLElement
3. `HTMLElement` where the view will be mounted
