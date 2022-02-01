---
id: introducing-producers
title: Introducing Producers
sidebar_label: Producers
---

[producer](/docs/api/producer)s are the central concept of Engine. Engine
recommends that our components should only represent the view, and have as
little logic as possible. Producers are where the logic lives in an Engine app.

Simplest place to see producers in action can be Todo list's footer. A producer
will count the number of pending todos, and show them in the view. Extract
`Footer` out of `src/App.tsx` into its own component. Create `src/Footer.tsx`
with following contents:

```tsx
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

`Footer` will trust that `pendingCount` is going to be available in the state,
and that `it'll always contain the correct number of pending todo items. Update `src/Footer.tsx` based on this assumption:

```diff
- const Footer = () => (
+ const Footer: view = ({ pendingCount = observe.pendingCount }) => (
  <footer className="footer">
    <span className="todo-count">
-     <strong>1</strong> items left
+     <strong>{pendingCount}</strong> items left
    </span>
    <ul className="filters">
```

The logic for counting pending items in the `Footer` itself, in fact, in a
traditional React app that's exactly what we would have done. But Engine
strongly recommends that business logic should be kept out of `view`s, and put
it in `producer`s. Add a `producer` to the Footer. In `src/Footer.tsx`, add
`pendingCounter` producer:

```diff
+ const pendingCounter: producer = ({
+   updatePendingCount = update.pendingCount,
+   todosById = observe.todosById
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
+ Footer.producers([pendingCounter]);

export default Footer;
```

`producer`s are just normal functions which are labeled with
[producer](/docs/api/producer) macro. They can access the state the same way as
`view`s; they even have access to `prop`s that a view might get from its parent.

To add a producer to a component, `.producers` property of a view is given an
array of producers.

Similar to `view`s, a producer is triggered whenever anything that it `observe`s
changes. `pendingCounter` producer Observes `todosById` object, so whenever
anything in todosById changes, this producer is executed. Whenever status of any
todo item is updated, `pendingCount` gets updated accordingly.

In the next chapter, we'll take a look at how producers make it possible to a
very create workflow for view <-> producer communication.
