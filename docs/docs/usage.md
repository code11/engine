---
id: usage
title: Usage
sidebar_label: Usage
---

## Install

To build React apps with Engine, 2 packages must be installed:

```sh
   yarn add @c11/engine.macro @c11/engine.react
```

`@c11/engine.macro` is the platform independent core of Engine. Engine makes
good use of babel-macros to take care of a bunch of things we'd otherwise do
manually. `@c11/engine.react` is needed for building Engine React applications.

Find out more about the Engine packages on [packages](packages) page.

## Instantiate

To create an Engine app, an instance of the `Engine` class from
`@c11/engine.macro` need to be created, and started:

This can go in `src/index.ts` of a traditional react app (created with
create-react-app):

```tsx
import React from "react";
import { Engine } from "@c11/engine.react";
import "./index.css";
import App from "./App";

const engine = new Engine({
  view: {
    element: <App />,
    root: "#root"
  }
});

engine.start();
```

Creating an `Engine` instance takes care of mounting our application. It is
possible to provide an initial state to it. More about Engine can be found in
[API docs for Engine](/docs/api/engine).

## Build

Engine react application are pretty much written like any other React
application, with few differences:

1. Only functional react components can become Engine [view](/docs/api/view)s
2. React components need to be labeled with `view` macro
3. State dependencies of a view are declared in its arguments (also called
   "header" of the view)

For example:

```tsx
import React from "react";
import { view, Observe, Update, producer } from "@c11/engine.macro";

const greeter: producer = ({
  name = Observe.name,
  updateGreeting = Update.greeting
}) => {
  if (!name) {
    updateGreeting.set("Bye bye");
  } else {
    updateGreeting.set("Hello");
  }
};

const App: view = ({
  name = Observe.name,
  greeting = Observe.greeting,
  updateName = Update.name
}) => {
  return (
    <>
      <h1 className="App-header">
        {greeting} {name}
      </h1>
      <input
        value={name}
        onChange={e => updateName.set(e.currentTarget.value)}
      />
    </>
  );
};

(App as any).producers = [greeter];

export default App;
```

This tiny example demonstrates pretty much all the Engine concepts needed to use
it!

Components labeled as [view](/docs/api/view) can [Observe](/docs/api/observe)
anything from state, and [Update](/docs/api/update) anything in the state.

Functions labeled as [producer](/docs/api/producer) behave pretty much the same
way as `view`s, but don't render anything on screen. Producers are where the
business logic should live.

[Quick start](quick-start-tutorial/setup) tutorial has a more involved
introduction to building an Engine app.
