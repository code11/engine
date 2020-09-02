---
id: mature-architecture
title: Mature Architecture
sidebar_label: Mature Architecture
---

Just the power of [view](/docs/api/view), [Observe](/docs/api/observe), and
[Update](/docs/api/update) would be a huge productivity gain in traditional
React applications. But Engine has a lot more to offer. Before we dive into more
features of Engine, let's discuss our application's architecture a bit.

Every UI is a representation of some business data. We call this critical
business data the user want to work with, **the essential state**. Careful
consideration is needed for what the shape our state is going to be, even for
smaller applications like our todos app. After all, habits maketh man.

We have kept our `todos` as an array in the state. It's usually a bad idea to
use arrays for storing critical business data (aka domain objects). What works
better is to store our domain objects in some sort of indexed data structure
(e.g `Object`), so we can have instant access to any domain object using just
its identifier. We'll see in this chapter, Engine has a unique way to very
efficiently utilize such state.

Domain objects represent our essential business data (e.g todos for a todos
app). They often cross boundaries of different components of a software product,
For example, going from database to a backend application, to a serialized form
for network transfer (e.g JSON), to UIs. It is advisable to keep a consistent
representation of our domain objects across different components of our system.
Doing so builds intuition and confidence in the system.

Usually we would have a unique `id` field in our database, which can uniquely
identify a todo. We don't really have any identifier for our todos yet. We'll
fake that, and add a fake `id` into every todo item our application creates.

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
shape of our state. Don't skip over this part, we'll introduce more of Engine's
magic during this transition.

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
