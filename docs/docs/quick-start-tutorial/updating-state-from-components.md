---
id: updating-state-from-components
title: Updating State from Components
sidebar_label: Updating State from Components
---

Rendering our state in components is one piece of the puzzle, another piece is
manipulating state from components. Let's make it possible to toggle the status
of our `Todo`s.

In src/Todo.tsx`,

```diff
import React from "react";
- import { view, Observe, Prop } from "@c11/engine.macro";
+ import { view, Observe, Prop, Update } from "@c11/engine.macro";

- const Todo: view = ({ title = Observe.todosById[Prop.id].title }) => (
+ const Todo: view = ({
+   title = Observe.todosById[Prop.id].title,
+   updateStatus = Update.todosyById[Prop.id].status
+ }) => (
  <li>
    <div className="view">
-      <input className="toggle" type="checkbox" />
+       <input
+         className="toggle"
+         type="checkbox"
+         checked={status === TodoStatuses.done}
+         onChange={() =>
+           updateStatus.set(
+             status === TodoStatuses.done
+               ? TodoStatuses.pending
+               : TodoStatuses.done
+           )
+         }
+       />
      <label>{title}</label>
      <button className="destroy" />
    </div>
  </li>
);

export default Todo;
```

We have:
1. Used `Observe.todosById<todoId>.status` to use it for deciding whether the
   checkbox for the `Todo` is checked or not
2. Used `Update.todosById<todoId>.status` to change status of our TodoItem.
   [Update](/docs/api/update) is the dual of [Observe](/docs/api/observe).
   Observe allow us to read any value from our global state, Update allow us to
   change them. `Update.<path>` returns an object with a number of methods to
   conveniently work with our state. You can read [more about Update in api
   docs](/docs/api/update).
