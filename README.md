# Code11 Engine

Engine is a meta-framework for creating web applications.

Engine keenly focuses on developer productivity while allowing creating robust
web applications with unprecedented simplicity.

## Goals

Engine strives to build applications with

- Small codebase. Less code, less bugs, more hairs still on head
- Less work for computer. Only compute what is needed for faster applications
- Less work for developer. Minimal API which gets out of developers' way. Allows
  focusing on business problems, not Engine problems

You can read more about the principles behind Engine and more on [Engine
Documentation](https://code11.github.io/engine/docs/) site.

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

Engine react applications are pretty much written like any other React
application, with few differences:

1. Only functional react components can become Engine
   [view](https://code11.github.io/engine/docs/api/view)s
2. React components need to be labeled with `view` macro
3. State dependencies of a view are declared in its arguments (also called
   "header" of the view)

For example:

```tsx
import React from "react";
import { view, observe, update, producer } from "@c11/engine.macro";

const greeter: producer = ({
  name = observe.name,
  updateGreeting = update.greeting
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
  updateName = update.name
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

Components labeled as [view](https://code11.github.io/engine/docs/api/view) can
[observe](https://code11.github.io/engine/docs/api/observe) anything from state,
and [update](https://code11.github.io/engine/docs/api/update) anything in the
state.

Functions labeled as
[producer](https://code11.github.io/engine/docs/api/producer) behave pretty much
the same way as `view`s, but don't render anything on screen. Producers are
where the business logic should live.

Head over to the [React Quick
start](https://code11.github.io/engine/docs/tutorials/react/setup) tutorial for
a more involved introduction to building an Engine React app.
