---
id: setup
title: Quick Start
sidebar_label: Setup
---

Although Engine itself is platform neutral, Engine's reactive features really
shine in context of boilerplate laden world of React. So let's get started with:

## Building a React Engine App

We are going to build a TodoMVC app. That's why todo apps exist, to be built in
introductory tutorials. You can take a look at the
[todomvc.com](http://todomvc.com/) to get a feeling of what we are about to
implement.

## Setup

Let's use `create-react-app` to set up a vanilla react app for us.

```sh
yarn create react-app engine-todos --template typescript
```

We are using the typescript template here. Engine itself is written in
Typescript, and we highly recommend using it.

Doing a `yarn start` will start a vanilla react app on
[localhost:3000](http://localhost:3000). Before we start building our glorious
todos app, let's port the vanilla React app to Engine.

### Install Engine

Following command will install engine dependencies for us:

```sh
yarn add @c11/engine.macro @c11/engine.react
```

`@c11/engine.macro` contain the platform agnostic core of Engine, and
`@c11/engine.react` contain the React bindings. You can read more about these,
and more engine packages on [packages](../packages) page.

### Create an Engine instance

First thing we need to do is create an `Engine` instance, and let it take
control of our app. In the `src/index.tsx` file:

```diff
import React from 'react';
- import ReactDOM from 'react-dom';
+ import { Engine } from "@c11/engine.react";
import './index.css';
import App from './App';

- ReactDOM.render(
-   <React.StrictMode>
-     <App />
-   </React.StrictMode>,
-   document.getElementById("root")
- );
+ const engine = new Engine({
+   view: {
+     element: <App />,
+     root: "#root"
+   }
+ });
+
+ engine.start();
```

1. We import and create an `Engine` instance
2. Instead of having `react-dom` mounting our app to DOM, we give that honor to
   Engine

That's it! We are running an Engine app now.

Now that we have our engine app set. Let's do some chores to set the stage for
building our glorious TodoMVC app:

### Add styles

We want to keep our focus on building the React side of things. Let's install
`todomvc-app-css` npm package provided by good people behind the TodoMVC
project with `yarn add todomvc-app-css`, and update our `src/index.tsx` file to
use it:

```diff
- import "./index.css";
+ import "todomvc-app-css/index.css";
import App from "./App";
- import * as serviceWorker from "./serviceWorker";
...
- // If you want your app to work offline and load faster, you can change
- // unregister() to register() below. Note this comes with some pitfalls.
- // Learn more about service workers: https://bit.ly/CRA-PWA
- serviceWorker.unregister();
```

We have

- Imported CSS from `todomvc-app-css`
- Removed `create-react-app`'s default css and service worker code that we are
  not going to use. We can safely delete them:
  ```sh
  rm src/index.css
  rm src/serviceWorker.ts
  ```

### Starter Markup

While we are at it, let's also update `/src/App.tsx` and add some markup to
make our app feel more like the TodoMVC. Replace contents of `/src/App.tsx`
with:

```tsx
import React from "react";

const App = () => (
  <section className="todoapp">
    <div>
      <header className="header">
        <h1>todos</h1>
      </header>
    </div>
  </section>
);

export default App;
```

Replacing the default JSX allow us to remove some more code that is dead now:
```sh
rm src/App.css
rm public/logo*
```

Remember that our CSS for our app is provided by `todomvc-app-css` npm package.
As long as we are using correct CSS classes, our app will keep looking right.
