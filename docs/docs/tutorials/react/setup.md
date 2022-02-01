## Quick Start

Although Engine itself is platform neutral, Engine's reactive features really
shine when building a React application.

## Building a React Engine App

This tutorial builds a TodoMVC app following the specs defined at
[todomvc.com](http://todomvc.com/).

## Setup

Use `@c11/engine.cli` to create an engine starter app.

```sh
npx @c11/engine.cli create engine-todo-app
```

Engine itself is written in Typescript, and recommends using it for creating
React applications using Engine.

`yarn start` can be used to start the app on
[localhost:8080](http://localhost:8080).

### Create an Engine instance

First step for building an Engine app is creating an `Engine` instance, and let
it take control of the app. In the `src/index.tsx` file let's add some todos:

```diff
 const app = engine({
   state: {
-    name: "John Doe",
-    item: {
-      a: "this is a",
-      b: "this is b",
-    },
+   initial: { }
   },
   use: [
     render(<App />, "#app", {
```

Engine takes care of mounting the app to DOM instead of having `react-dom`.

This creates a valid, running Engine app.

Up next: some chores to set the stage for building the TodoMVC app:

### Add styles

To keep the focus on building the React side of things, install
`todomvc-app-css` npm package with `yarn add todomvc-app-css`. Update
`src/App.tsx` file to use it:

```diff
+ import "todomvc-app-css/index.css";
```

This step:

- Imported CSS from `todomvc-app-css`

### Starter Markup

To conclude this chapter, update `src/App.tsx` and add some markup to make the
app feel more like the TodoMVC. Replace contents of `src/App.tsx` with:

```tsx
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

CSS is provided by `todomvc-app-css` npm package, which mandates using correct
CSS classes to keep the app looking right.
