---
id: usage
title: Usage
sidebar_label: Usage
---

## Install

To build React apps with Engine, we need to install 2 packages:

```sh
   yarn add @c11/engine.macro @c11/engine.react
```

`@c11/engine.macro` is the platform independent core of Engine. Engine makes
good use of babel-macros to take care of a bunch of things we'd otherwise do
manually. `@c11/engine.react` is needed for building Engine React applications.

We can read more about the Engine packages on [packages](packages) page.

## Instantiate

First thing after installation, we need to create an instance of `Engine` class
from `@c11/engine.macro`, and well, start the engine.

This can go in `src/index.ts` of a traditional react app (created with create-react-app):

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

Creating an `Engine` instance takes care of mounting our application. We can
provide an initial state to it as well. We can read more about it in [API docs
for Engine](/docs/api/engine).

## Build

We build our react application pretty much just like any other React
application, with few differences:

1. We can only use function components
2. We need to label our components with `view` macro
3. We declare our state dependencies in arguments of our Component

For example, let's put this snippet in our `src/App.tsx` file:

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

This tiny example demonstrates pretty much everything you need to know about
Engine to use it!

Components labeled as [view](/docs/api/view) can [Observe](/docs/api/observe)
anything from state, and [Update](/docs/api/update) anything in state as well.

Functions labeled as [producer](/docs/api/producer) behave pretty much the same
way as `view`s, but don't render anything on screen.

Let's head over to [quick start](quick-start-tutorial/setup) for a more involved
introduction to building an Engine app.
