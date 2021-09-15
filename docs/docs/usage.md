---
id: usage
title: Usage
sidebar_label: Usage
---

## Install

Fastest way to get started with Engine is by using the Engine
[CLI](https://code11.github.io/engine/docs/cli).

```
npm i -g @c11/engine.cli
engine create my-app
cd my-app
npm start
```

`engine create <app-name>` will setup an npm project with all the dependencies
required for building an engine app installed. Engine itself is built in a
modular way in the form of multiple packages. You can read more about the
Engine packages on [packages](packages) page.

## Instantiate

To create an Engine app, an instance of the `Engine` class from
`@c11/engine.runtime` need to be created. This goes in `src/index.ts` of a
an app (created with engine CLI):

```tsx
import { engine } from "@c11/engine.runtime";
import { render } from "@c11/engine.react";
import "./index.css";
import App from "./App";

const app = engine({
  use: [render(<App />, "#root")],
});

app.start();
```

Creating an `Engine` instance takes care of mounting our application. It is
possible to provide an initial state to it. More about Engine can be found in
[API docs for Engine](/docs/implementations/react).

## Build

Engine react applications are pretty much written like any other React
application, with few differences:

1. Only functional react components can become Engine [view](/docs/api/view)s
2. React components need to be labeled with `view`
3. State dependencies of a view are declared in its arguments (also called
   "header" of the view)

For example:

```tsx
const greeter: producer = ({
  name = observe.name,
  updateGreeting = update.greeting,
}) => {
  if (!name) {
    updateGreeting.set("Bye bye");
  } else {
    updateGreeting.set("Hello");
  }
};

const App: view = ({
  name = observe.name,
  greeting = observe.greeting,
  updateName = update.name,
}) => {
  return (
    <>
      <h1 className="App-header">
        {greeting} {name}
      </h1>
      <input
        value={name}
        onChange={(e) => updateName.set(e.currentTarget.value)}
      />
    </>
  );
};

App.producers([greeter]);

export default App;
```

This tiny example demonstrates pretty much all the Engine concepts needed to use
it!

[View](/docs/api/view)s can [observe](/docs/api/observe) anything from
[state](/docs/concepts/state), and [update](/docs/api/update) anything in the
state.

[Producer](/docs/api/producer)s behave pretty much the same
way as `view`s, but don't render anything on screen. Producers are where the
business logic should live.

[Quick start](/docs/tutorials/react/setup) tutorial has a more involved
introduction to building an Engine app.
