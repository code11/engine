---
id: mature-architecture
title: Recommended Architecture
sidebar_label: Recommended Architecture
---

Just the power of [view](/docs/api/view), [Observe](/docs/api/observe), and
[Update](/docs/api/update) would be a huge productivity gain in traditional
React applications. But Engine has a lot more to offer. Before we dive into more
features of Engine, let's discuss our application's architecture a bit.

Let's start with modifying our initial state a bit. In `src/index.tsx`

```diff
  state: {
    initial: {
+     newTodoTitle: null,
-     todos: [],
+     todosById: {},
    }
  },
```

1. We've changed our `todos` to `todosById`, which now contains an object, in
   which we'll store our todo items in `id: TodoItem` form.
2. We have added `newTodoTitle` key to store state of todo item currently being
   added. Engine don't necessitates doing this, but it's a good practice.

State like `newTodoTitle` is what is sometimes called **accidental state**. It
is data that isn't essential to the problem our software is trying to solve, but
is needed to support our UI.

Let's start updating `App` component in `src/App.tsx` to make up for change in
shape of our state.

```diff
-const App: view = ({ todos = Observe.todos }) => {
+const App: view = ({ todosById = Observe.todosById }) => {
+  const todos = Object.keys(todosById).map((tid: string) => (
+    <Todo id={tid} key={tid} />
+  ));
+
   return (
       ...
-          <ul className="todo-list">{todos.map(Todo)}</ul>
+          <ul className="todo-list">{todos}</ul>
```

Notice that we aren't passing the actual `state.todosById.<todo>` to `Todo`
component as we were earlier. We are passing only the todo ID. **This is the
recommended way of rendering domain objects in Engine**. We'll see why in just a
minute, after we've updated our `TodoForm`.

```diff
 const TodoForm: view = ({
-  todos = Observe.todos,
-  updateTodos = Update.todos,
+  updateTodosById = Update.todosById,
 }) => {
   ...
   const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
     if (e.key === "Enter") {
-      const newTodos = [
-        ...todos,
-        { isDone: false, title: e.currentTarget.value }
-      ];
-      updateTodos.set(newTodos);
+      const id = new Date().getTime();
+      updateTodos.merge({
+        [id]: { id, isDone: false, title: e.currentTarget.value }
+      });
```

`Update.<key>.merge` allow us to add to objects stored in our state, without
needing to `Observe` them.

With this, we can add new todo items to our state. But how can `Todo` component
render them? Remember that just `Todo` gets the `id` of a todo item.

Engine has a really innovative way to allow components render domain objects.
Let's modify the `Todo` component to tie everything together:

```diff
-import { view, Observe, Update } from "@c11/engine.macro";
+import { view, Observe, Update, Prop } from "@c11/engine.macro";
 import "todomvc-app-css/index.css";

-const Todo: React.FC<{ title: string }> = ({ title }, index) => (
-  <li key={index}>
+const Todo: view = ({ todo = Observe.todosById[Prop.id] }) => (
+  <li>
     <div className="view">
       <input className="toggle" type="checkbox" />
-      <label>{title}</label>
+      <label>{todo.title}</label>
       <button className="destroy" />
     </div>
-    <input className="edit" value={title} />
+    <input className="edit" value={todo.id} />
   </li>
 );
```

1. We imported another macro named `Prop`. `Prop` allows us to refer to a
   component's React props.
2. We changed the type of our `Todo` component from `React.FC` to `view`. This
   is what allows `Observe` to do its magic in
   [destructured](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
   arguments
3. Instead of laying out the complete path of state element which we want to
   `Observe`, we ask engine to "Give me the value stored in `Prop.id` key of
   `state.todosById`". By doing this, Engine gives us a live value representing
   the todo item identified by its `props.id`. Any time, and only when something
   in this todo item changes, e.g its `isDone` status, our `Todo` component will
   be re-rendered.

This approach has some notable advantages:

1. Our `Todo` will not need to go through unnecessary rendering whenever its
   parent is re-rendered. This is one of few problems in React land, for which,
   often the recommended solution is to use an immutable data-structure for the
   state, and check for referential equality in something like
   `shouldComponentUpdate`. Using `Observe` and `Prop` combo, we not only made
   our component more efficient, but we also saved ourselves from a lot
   cognitive load, and possible plumbing work.
2. Our component became a lot more independent. It exposes a minimal surface to
   its parent (it asks only for `id`). This saves us from a whole lot of
   plumbing that goes on in React applications. This allow us to focus our
   attention on the business aspects of our problem, instead of React aspects.

Prop is not the only macro which we can make a magical combination with
`Observe`. We can read about more such macros in [input
macros](/docs/api/input-macros/prop) section.

### Updating the Todos

Just like we saw in previous chapter, we can update any data in our state with
[Update](/docs/api/update). For example, to mark a todo as done when Done
checkbox is clicked, we need to just make this change:

```diff
- const Todo: view = ({ todo = Observe.todosById[Prop.id], updateTodo = Update.todosById[Prop.id]}) => {
+ const Todo: view = ({ todo = Observe.todosById[Prop.id], updateTodo = Update.todosById[Prop.id]}) => {
  return (
    <li>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
+           onChange={() => updateTodo.merge({ isDone: !todo.isDone })}
        />
```

Similarly, to put the todo in "Editing" state, we can do

```diff
-        <label>{todo.title}</label>
+        <label onDoubleClick={() => updateTodo.merge({ ...todo, isEditing: true })}>{todo.title}</label>
```

### Homework

Your homework for the day is:

1. Make `Todo` component fully functional
2. Make the footer working
3. Implement "Toggle all" feature

You can take a look at [React implementation of
TodoMVC](http://todomvc.com/examples/react/#/) to figure out all the
functionality that need to be built.

<details>
  <summary>Solution</summary>

```tsx
import React, { KeyboardEvent, ChangeEvent } from "react";
import { view, Observe, Update, Prop } from "@c11/engine.macro";
import "todomvc-app-css/index.css";

const Todo: view = ({
  todo = Observe.todosById[Prop.id],
  updateTodo = Update.todosById[Prop.id]
}) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateTodo.merge({
        value: e.currentTarget.value,
        isEditing: false
      });
    }

    if (e.key === "Escape") {
      updateTodo.merge({
        value: e.currentTarget.value,
        isEditing: false
      });
    }
  };

  return (
    <li className={todo.isEditing ? "editing" : ""}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.isDone}
          onChange={() => updateTodo.merge({ isDone: !todo.isDone })}
        />
        <label onDoubleClick={() => updateTodo.merge({ isEditing: true })}>
          {todo.title}
        </label>
        <button className="destroy" onClick={() => updateTodo.remove()} />
      </div>
      <input
        className="edit"
        value={todo.title}
        onKeyDown={handleKeyDown}
        onBlur={() => updateTodo.merge({ isEditing: false })}
        onChange={e => updateTodo.merge({ title: e.currentTarget.value })}
      />
    </li>
  );
};

const TodoForm: view = ({
  updateTodos = Update.todosById,
  newTodoTitle = Observe.newTodoTitle,
  updateNewTodoTitle = Update.newTodoTitle
}) => {
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateNewTodoTitle.set(e.currentTarget.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const id = new Date().getTime();

      updateTodos.merge({
        [id]: { id, isDone: false, title: e.currentTarget.value }
      });
      updateNewTodoTitle.set("");
    }

    if (e.key === "Escape") {
      updateNewTodoTitle.set("");
    }
  };

  return (
    <input
      className="new-todo"
      placeholder="What needs to be done?"
      autoFocus={true}
      onKeyDown={handleKeyDown}
      onChange={handleOnChange}
      value={newTodoTitle || ""}
    />
  );
};

const App: view = ({
  todosById = Observe.todosById,
  updateTodosById = Update.todosById,
  filter = Observe.filter,
  updateFilter = Update.filter
}) => {
  const incompleteTodosCount = Object.values(todosById).reduce(
    (accum: number, val) => ((val as any).isDone ? 0 : 1) + accum,
    0
  );

  const todoIdsToDisplay = Object.entries(todosById)
    .map(([key, value]) => {
      switch (filter) {
        case "completed":
          return (value as any).isDone ? key : null;
        case "active":
          return (value as any).isDone ? null : key;
        default:
          return key;
      }
    })
    .filter(Boolean) as Array<string>;

  const handleToggleAll = () => {
    const nextTodos = Object.values(todosById)
      .map((todo: any) => {
        return {
          ...todo,
          isDone: incompleteTodosCount !== 0
        };
      })
      .reduce((accum, todo) => {
        accum[todo.id] = todo;

        return accum;
      }, {});

    updateTodosById.merge(nextTodos);
  };

  const todosJsx = todoIdsToDisplay.map((tid: string) => (
    <Todo id={tid} key={tid} />
  ));

  return (
    <section className="todoapp">
      <div>
        <header className="header">
          <h1>todos</h1>
        </header>

        <TodoForm />

        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            checked={incompleteTodosCount === 0}
            onChange={handleToggleAll}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>

          <ul className="todo-list">{todosJsx}</ul>
        </section>

        <footer className="footer">
          <span className="todo-count">
            <strong>{incompleteTodosCount}</strong> items left
          </span>
          <ul className="filters">
            <li>
              <a
                href="#/"
                className={filter === "all" ? "selected" : ""}
                onClick={() => updateFilter.set("all")}
              >
                All
              </a>
            </li>
            <li>
              <a
                href="#/active"
                className={filter === "active" ? "selected" : ""}
                onClick={() => updateFilter.set("active")}
              >
                Active
              </a>
            </li>
            <li>
              <a
                href="#/completed"
                className={filter === "completed" ? "selected" : ""}
                onClick={() => updateFilter.set("completed")}
              >
                Completed
              </a>
            </li>
          </ul>
          <button className="clear-completed">Clear completed</button>{" "}
        </footer>
      </div>
    </section>
  );
};

export default App;
```
</details>
