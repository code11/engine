---
id: static-ui
title: Static UI
sidebar_label: Static UI
---

This tutorial takes a top-down approach for building the todos app. This chapter
adds the static UI of our `App`, which will be given life with Engine in
subsequent chapters.

Add the todos `<input>` in `App.tsx`:

```tsx
import React from "react";
import "todomvc-app-css/index.css";

const App = () => (
  <section className="todoapp">
    <header className="header">
      <h1>todos</h1>
    </header>
    <input
      className="new-todo"
      placeholder="What needs to be done?"
      autoFocus={true}
    />
```

Next section lists all the todos, and also has a control to toggle "Done"
status of all todo items.

```tsx
    <section className="main">
      <input id="toggle-all" className="toggle-all" type="checkbox" />
      <label htmlFor="toggle-all">Mark all as complete</label>

      <ul className="todo-list">
        <li>
          <div className="view">
            <input className="toggle" type="checkbox" />
            <label>Give life to my TODOs</label>
            <button className="destroy" />
          </div>
        </li>
      </ul>
    </section>
```

And finally, the footer has some more controls for viewing todos, and clearing
them.

```tsx
    <footer className="footer">
      <span className="todo-count">
        <strong>1</strong> items left
      </span>
      <ul className="filters">
        <li>
          <a href="#/" className="selected">
            All
          </a>
        </li>
        <li>
          <a href="#/active">Active</a>
        </li>
        <li>
          <a href="#/completed">Completed</a>
        </li>
      </ul>
      <button className="clear-completed">Clear completed</button>
    </footer>
  </section>
);

export default App;
```

Next chapter will populate todo items from state instead of hard-coding them in
JSX.
