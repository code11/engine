---
id: setup
title: Quick Start with React
sidebar_label: Setup
---

Although Engine itself is platform neutral, Engine's reactive features really
shine when building a React application.

## Building a React Engine App

This tutorial builds a TodoMVC app following the specs defined at
[todomvc.com](http://todomvc.com/).

## Setup

Use `create-react-app` to create a vanilla react app.

```sh
yarn create react-app engine-todos --template typescript
```

Engine itself is written in Typescript, and recommends using it for creating
React applications using Engine.

`yarn start` can be used to start a vanilla react app on
[localhost:3000](http://localhost:3000).

### Install Engine

Following command will install engine dependencies:

```sh
yarn add @c11/engine.macro @c11/engine.react
```

`@c11/engine.macro` contain the platform agnostic core of Engine, and
`@c11/engine.react` contain the React bindings. Find out more about engine
packages on [packages](/docs/packages) page.

### Create an Engine instance

First step for building an Engine app is creating an `Engine` instance, and let
it take control of the app. In the `src/index.tsx` file:

```diff
import React from 'react';
- import ReactDOM from 'react-dom';
+ import { engine } from "@c11/engine.react";
import './index.css';
import App from './App';

- ReactDOM.render(
-   <React.StrictMode>
-     <App />
-   </React.StrictMode>,
-   document.getElementById("root")
- );
+ const engine = engine({
+   view: {
+     element: <App />,
+     root: "#root"
+   }
+ });
+
+ engine.start();
```

Engine takes care of mounting the app to DOM instead of having `react-dom`.

This creates a valid, running Engine app.

Up next: some chores to set the stage for building the TodoMVC app:

### Add styles

To keep the focus on building the React side of things, install
`todomvc-app-css` npm package with `yarn add todomvc-app-css`. Update
`src/index.tsx` file to use it:

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

This step:

- Imported CSS from `todomvc-app-css`
- Removed `create-react-app`'s default css and service worker code. Files
  containing dead code can now be deleted:
  ```sh
  rm src/index.css
  rm src/serviceWorker.ts
  ```

### Starter Markup

To conclude this chapter, update `/src/App.tsx` and add some markup to make the
app feel more like the TodoMVC. Replace contents of `/src/App.tsx` with:

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

Replacing the default JSX allows removing some more code that is dead now:

```sh
rm src/App.css
rm public/logo*
```

CSS is provided by `todomvc-app-css` npm package, which mandates using correct
CSS classes to keep the app looking right.
