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

## Updating state from components

Rendering our state in components is one piece of the puzzle, another piece is
manipulating state from components. We'll now make the big todos `<input>` work,
so that it can add new todos to our state. We want to add a todo whenever user
presses `Enter` key, so we'll add a `onKeyDown` event:

```diff
const App: view = ({ todos = Observe.todos }) => {
+  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
+    console.warn('Keypress', e);
+  };
   ...
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          autoFocus={true}
+         onKeyDown={handleKeyDown}
        />
```

In a vanilla react app, we could simply use a `setState` call to add the new
Todo. But if we want to keep a single-source-of-truth global state, we have to
deal with a bunch of boilerplate to achieve the simple thing. That could either
be the whole dance between actions, reducers and selectors of Redux, or passing
the callback props down a staircase of components in vanilla react.

To achieve the same with Engine, we need access to an `Update` object for
`state.todos`. Just like `Observe.todos` gives us a reference to live `todos`
array in our state, we have `Update.todos` to give us an update object:

```diff
- import { view, Observe } from "@c11/engine.macro";
+ import { view, Observe, Update } from "@c11/engine.macro";
...

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
+    if (e.key === "Enter") {
+      const newTodos = [
+        ...todos,
+        { isDone: false, title: e.currentTarget.value }
+      ];
+
+      updateTodos.set(newTodos);
    }
  };
```

If the key user has pressed is the `Enter` key, we compute the next set of
todos, and `Update.todos` allow us to replace existing todos in our state with
this new array. It's as easy as using vanilla React's `setState`, but we get to
keep our global state outside of components.

But do it really solve the problem of passing callback props down multiple
levels of components? As a matter of fact, it do. **`Update` and `Observe` can
be used at any level in our component tree**. To demonstrate this, let's extract
our `<input>` out to its own component `TodoForm`. In `src/App.tsx`, let's add:

```tsx
const TodoForm: view = ({
  todos = Observe.todos,
  updateTodos = Update.todos
}) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const newTodos = [
        ...todos,
        { isDone: false, title: e.currentTarget.value }
      ];

      updateTodos.set(newTodos);
    }
  };

  return (
    <input
      className="new-todo"
      placeholder="What needs to be done?"
      autoFocus={true}
      onKeyDown={handleKeyDown}
    />
  );
};
```

Now we can update our `App` component to use this component instead:

```diff
- const App: view = ({ todos = Observe.todos, updateTodos = Update.todos }) => {
+ const App: view = ({ todos = Observe.todos }) => {
-   const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
-     if (e.key === "Enter") {
-       const newTodos = [
-         ...todos,
-         { isDone: false, title: e.currentTarget.value }
-       ];
-
-       updateTodos.set(newTodos);
-     }
-   };
-
  return (
    ...
-        <input
-          className="new-todo"
-          placeholder="What needs to be done?"
-          autoFocus={true}
-          onKeyDown={handleKeyDown}
-        />
+        <TodoForm />
```

## Introducing new state

`Observe.<key>` and `Update.<key>` can do a lot more than that. It is possible
to introduce completely new state to our global store. For instance, let's
convert our `TodoForm` into a [controlled React
component](https://reactjs.org/docs/forms.html#controlled-components) so that we
can clear the input when user presses `Enter` or `Escape`.

```diff
const TodoForm: view = ({
  todos = Observe.todos,
  updateTodos = Update.todos,
+  editingTodo = Observe.editingTodo,
+  updateEditingTodo = Update.editingTodo
}) => {
+  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
+    updateEditingTodo.set(e.currentTarget.value);
+  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      ...
+     updateEditingTodo.set("");
    }
+
+   if (e.key === "Escape") {
+     updateEditingTodo.set("");
+   }
  };

  return (
    <input
       ...
+      onChange={handleOnChange}
+      value={editingTodo || ""}
```

We added observer for `state.editingTodo` without initially declaring it in our
state we passed to `Engine` in `src/index.tsx`. We also added
`Update.editingTodo`, which we then use on the todo `<input>`'s `onChange`.
