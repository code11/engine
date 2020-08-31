---
id: state
title: Use the State Luke!
sidebar_label: State
---

Engine, like Redux, recommends keeping a single source of truth for our
application's state. Let's provide some initial todos for our app. In
`src/index.tsx`

```diff
const engine = new Engine({
+ state: {
+   initial: {
+     todos: [
+       { title: 'Add initial state to engine', isDone: false },
+       { title: 'Use initial state in components', isDone: false }
+     ]
+   }
+ },
  view: {
    element: <App />,
    root: "#root"
  }
});
```

This is equivalent to creating a store in Redux, and initializing with intial
state. We can read more about creating the `Engine` instance in API docs for
[Engine](/docs/api/engine). Now that we have some todo items in our state, it's time
to show them in our component.

## Using state in components

Wanna see a magic trick? Add these 3 lines to our `src/App.tsx`:

```diff
import React from "react";
import "todomvc-app-css/index.css";
+ import { view, Observe } from "@c11/engine.macro";
+
+ const App: view = ({ todos = Observe.todos }) => {
+   console.warn("TODOS", todos);
```

We can see todos from our state printed in console! This is all the selectors we
have to write. Engine does its magic with babel-macros behind the scenes, and
allow us to observe any part of our state with just few characters.

Time to put these todos in jsx. In `src/App.tsx`, let's extract the `<Todo>`
component out of `<App>` so that we can easily do `todos.map(Todo)`.

```tsx
const Todo: React.FC<{ title: string }> = ({ title }) => (
  <li>
    <div className="view">
      <input className="toggle" type="checkbox" />
      <label>{title}</label>
      <button className="destroy" />
    </div>
    <input className="edit" value={title} />
  </li>
);
```

Now we can update our `App` component with:

```diff
        <section className="main">
          <input id="toggle-all" className="toggle-all" type="checkbox" />
          <label htmlFor="toggle-all">Mark all as complete</label>

          <ul className="todo-list">
+            {todos.map(Todo)}
          </ul>
        </section>
```
