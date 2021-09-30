# Code11 Engine

[![push](https://github.com/code11/engine/workflows/CI/badge.svg?branch=master&event=push)](https://github.com/code11/engine/actions)
[![codecov](https://codecov.io/gh/code11/engine/branch/master/graph/badge.svg?token=K3UZLXWOEK)](https://codecov.io/gh/code11/engine)

Engine is state management and development solution for creating web applications with unprecedented simplicity.

You can read more on the [Engine Documentation](https://code11.github.io/engine/docs/) site.

## Goals

Engine strives to build applications with

- Small codebase. Less code, less bugs, more hairs still on head
- Less work for computer. Only compute what is needed for faster applications
- Less work for developer. Minimal API which gets out of developers' way.

## Run

Engine provides a convenient [CLI](https://code11.github.io/engine/docs/cli) to
work with engine apps.

```
npm i -g @c11/engine.cli
engine create my-app
cd my-app
npm start
```

## Build

You can use Engine for building React applications and you won't be needing classes, hooks or
any other state management libraries.

You will pretty much be needing only the JSX aspect of React and a few Engine keywords.

Here's an example:

```tsx
// app.tsx
export const App: view = ({
  name = observe.name,
  greeting = observe.greeting,
  updateName = update.name,
}) => (
  <div>
    <h1>{greeting}</h1>
    <input
      value={name}
      onChange={(e) => updateName.set(e.currentTarget.value)}
    />
  </div>
);

const greeter: producer = ({
  name = observe.name,
  updateGreeting = update.greeting,
}) => {
  if (!name) {
    updateGreeting.set("Enter your name below.");
  } else {
    updateGreeting.set(`Hello ${name}!`);
  }
};

App.producers([greeter]);
```

```tsx
// index.tsx
import { engine } from "@c11/engine.runtime";
import { render } from "@c11/engine.react";
import { App } from "./app";

const app = engine({
  state: {
    name: "Foo Bar",
  },
  use: [render(<App />, "#app")],
});

app.start();
```

This tiny example demonstrates pretty much all the Engine concepts!

Components labeled as [view](https://code11.github.io/engine/docs/api/view) can
[observe](https://code11.github.io/engine/docs/api/observe) anything from state,
and [update](https://code11.github.io/engine/docs/api/update) anything in the
state.

Functions labeled as
[producer](https://code11.github.io/engine/docs/api/producer) is where the
business logic should live and use the state to store and read data.

Head over to the [React Quick
start](https://code11.github.io/engine/docs/tutorials/react/setup) tutorial for
a more involved introduction to building an Engine React app.
