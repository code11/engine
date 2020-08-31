---
id: static-ui
title: Static UI
sidebar_label: Static UI
---

We'll take a top-bottom approach for building our todos app. Let's first add
some static UI to our `App` component, which we'll give life to with Engine
later.

First thing we want to add is the todos input. In `App.tsx`:

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
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          autoFocus={true}
        />
...
```

Next comes our main section which lists all the todos, and also has a control to
toggle "Done" status of all todo items.

```tsx
        ...
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
              <input className="edit" value={"Give life to my TODOs"} />
            </li>
          </ul>
        </section>
```

And finally, the footer of our app, which has some more controls for viewing
todos, and clearing them.

```tsx
        ...

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
          <button className="clear-completed">Clear completed</button>{" "}
        </footer>
      </div>
    </section>
  );
}

export default App;
```

That's the entire app we want to build. None of the UI works of course, that's
what we are going to do next.

Let's start with making our todo items come from state, instead of hard-coding
them in Jsx.
