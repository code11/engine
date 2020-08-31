---
id: setup
title: Quick Start
sidebar_label: Setup
---

Although Engine itself is platform neutral, Engine's reactive features really
shine in context of boilerplate laden world of React. So let's get started with:

## Building a React Engine App

We are going to build a Todo&trade; MVC app. That's why todo apps exist, to be
built in introductory tutorials. You can take a look at the
[todomvc.com](http://todomvc.com/) to get a feeling of what we are about to
implement.

## Setup

Let's use `create-react-app` to set up a vanilla react app for us.

```sh
yarn create react-app engine-todos --template typescript
```

We are using the typescript template here. Engine itself is written in Ts, and
we highly recommend using it.

Doing a `yarn start` will start a vanilla react app on
[localhost:3000](http://localhost:3000). Before we start building our glorious
todos app, let's port the vanilla app to Engine.

### Install Engine

Following command will install engine dependencies for us:

```sh
yarn add @c11/engine.macro @c11/engine.react
```

`@c11/engine.macros` contain the platform agnostic core of Engine, and
`@c11/engine.react` contain the React bindings. You can read more about these,
and more engine packages on [packages](packages) page.

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

1. We import and instantiate an `Engine` instance
2. Instead of having `react-dom` mounting our app to DOM, we give that honor to
   Engine

That's it! We are running an Engine app now.

Now that we have our engine app set. Let's do some chores to set the stage for
building our glorious TodoMVC app:

1. **Add styles**

  We want to keep our focus on building the React side of things. Let's install
  `todomvc-app-css` npm package provided by good behind the TodoMVC project with
  `yarn add todomvc-app-css`, and update our `src/App.tsx` file to use it:

  ```tsx
  import React from "react";
  import "todomvc-app-css/index.css";

  function App() {
    return (
      <section className="todoapp">
        <div>
          <header className="header">
            <h1>todos</h1>
          </header>
        </div>
      </section>
    );
  }

  export default App;
  ```
  Notice that we have:

    1. Imported CSS from `todomvc-app-css`
    2. Removed create-react-app's default JSX from `src/App.tsx` file, and added
       just a "todo" heading. Since we are relying on CSS provided by
       `todomvc-app-css`, we have to use its predefined CSS classes.

2. **Remove unused code**

  1. `rm src/App.css`
  1. `rm public/logo*`

Let's head over to next step and add static UI for our todos app.
