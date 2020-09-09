---
id: introducing-producers
title: Introducing Producers
sidebar_label: Producers
---

[Producer](/docs/api/producer)s are the central concept of Engine. Engine
recommends that our components should only represent the view, and have as
little logic as possible (ideally components should have no logic at all).
Producers are where logic lives in an Engine app.

Simplest place to see producers in action can be our Todo list's footer. We'll
use a producer to count the number of pending todos, and show them in our view.
As we've done so far, let's first extract `Footer` out of `src/App.tsx`, into
its own component. Create `src/Footer.tsx` with following contents:

```tsx
import React from "react";

const Footer = () => (
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
);

export default Footer;
```

Update `src/App.tsx` to use `Footer`:

```diff
+ import Footer from "./Footer";
...
-    <footer className="footer">
-      <span className="todo-count">
-        <strong>1</strong> items left
-      </span>
-      <ul className="filters">
-        <li>
-          <a href="#/" className="selected">
-            All
-          </a>
-        </li>
-        <li>
-          <a href="#/active">Active</a>
-        </li>
-        <li>
-          <a href="#/completed">Completed</a>
-        </li>
-      </ul>
-      <button className="clear-completed">Clear completed</button>{" "}
-    </footer>
+    <Footer />
```

We'll believe in ourselves, and trust that `pendingCount` is going to be
available in our state, and it'll always contain the correct number of pending
todo items. Update our `src/Footer.tsx` based on this assumption:

```diff
+ import { view, Observe } from "@c11/engine.macro";
- const Footer = () => (
+ const Footer: view = ({ pendingCount = Observe.pendingCount }) => (
  <footer className="footer">
    <span className="todo-count">
-     <strong>1</strong> items left
+     <strong>{pendingCount}</strong> items left
    </span>
    <ul className="filters">
```

We could write the logic for counting pending items in the `Footer` itself, in
fact, in a traditional React app that's exactly what we would have done. But
Engine strongly recommends that we keep our logic out of our `view`s, and put it
in `producer`s. Let's add a `producer` to our Footer. In `src/Footer.tsx`, add
`pendingCounter` producer:

```diff
+ const pendingCounter: producer = ({
+   updatePendingCount = Update.pendingCount,
+   todosById = Observe.todosById
+ }) => {
+   const pendingCount = Object.values(
+     todosById as { [id: string]: TodoItem }
+   ).reduce(
+     (accum: number, todo) =>
+       todo.status === TodoStatuses.done ? accum : accum + 1,
+     0
+   );
+
+   updatePendingCount.set(pendingCount);
+ };
+
+ (Footer as any).producers = [pendingCounter];

export default Footer;
```

`producer`s are just normal functions which are labeled with
[producer](/docs/api/producer) macro. They can access the state the same way as
`view`s; they even have access to `Prop`s that a view might get from its parent.

To add a producer to a component, we assign a `.producers` property to the
component, and pass it an array of producers.

Similar to `view`s, a producer is triggered whenever anything that it `Observe`s
changes. Our `pendingCounter` producer Observes `todosById` object, so whenever
anything in todosById changes, our producer is executed. Whenever status of any
todo item is updated, we see our `pendingCount` to have updated accordingly.

In the next chapter, we'll take a look at how producers make it possible to a
very create workflow for view <-> producer communication.
