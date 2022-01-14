# Code11 Engine

[![push](https://github.com/code11/engine/workflows/CI/badge.svg?branch=master&event=push)](https://github.com/code11/engine/actions)
[![codecov](https://codecov.io/gh/code11/engine/branch/master/graph/badge.svg?token=K3UZLXWOEK)](https://codecov.io/gh/code11/engine)

Engine is state management and development solution for creating web applications.

See [docs](https://code11.github.io/engine/docs/).

## Usage

Get started using the [cli](https://code11.github.io/engine/docs/cli):

```
npx @c11/engine.cli create my-app
cd my-app
npm start
```

## Example

```tsx
// App.tsx
export const App: view = ({
  name = observe.name,
  greeting = observe.greeting,
  updateName = update.name,
}) => (
  <div>
    <h1>{greeting}</h1>
    <input
      defaultValue={name}
      onChange={(e) => updateName.set(e.currentTarget.value)}
    />
  </div>
);

const greeter: producer = ({
  name = observe.name,
  updateGreeting = update.greeting,
}) => {
  const greeting = name ? "Enter your name:" : `Hello ${name}!`;
  updateGreeting.set(greeting);
};

App.producers([greeter]);
```

```tsx
// index.tsx
import { engine } from "@c11/engine.runtime";
import { render } from "@c11/engine.react";
import { App } from "./App";

const app = engine({
  state: {
    name: "Foo Bar",
  },
  use: [render(<App />, "#app")],
});

app.start();
```

This tiny example demonstrates the Engine concepts and most of it's api.

The rendering is done by [views](https://code11.github.io/engine/docs/api/view) which
[observe](https://code11.github.io/engine/docs/api/observe) 
and [update](https://code11.github.io/engine/docs/api/update) anything in the
state.

Business logic sits in
[producers](https://code11.github.io/engine/docs/api/producer) that can be added to views.


