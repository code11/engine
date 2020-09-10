---
id: state-as-comm-mechanism
title: State as Communication Channel
sidebar_label: State as Communication Channel
---

We'll now make it possible to add new `TodoItem`s to our state. To start off,
we'll extract `TodoForm` component out of `src/App.tsx`. Create a new file
`src/TodoForm.tsx`, with following contents:

```tsx
import React from "react";

const TodoForm = () => (
  <input
    className="new-todo"
    placeholder="What needs to be done?"
    autoFocus={true}
  />
);

export default TodoForm;
```

And update `src/App.tsx` accordingly:

```diff
+ import TodoForm from "./TodoForm";
...
-    <input
-      className="new-todo"
-      placeholder="What needs to be done?"
-      autoFocus={true}
-    />
+    <TodoForm />
```

Since global-state is the only kind of state recommended in Engine, we'll keep a
state variable for what user is typing in our `TodoForm` input. Update
`src/TodoForm.tsx` to make its content be:

```tsx
import React from "react";
import { view, Observe, Update } from "@c11/engine.macro";

const TodoForm: view = ({
  updateNewTodoTitle = Update.newTodoTitle,
  newTodoTitle = Observe.newTodoTitle
}) => (
    <input
      className="new-todo"
      placeholder="What needs to be done?"
      autoFocus={true}
      value={newTodoTitle || ""}
      onChange={e => updateNewTodoTitle.set(e.currentTarget.value)}
    />
  );

export default TodoForm;
```

We have,
1. Labeled our `TodoForm` as `view`, so that we can use
   [Observe](/docs/api/observe) and [Update](/docs/api/update) in it
2. Introduced a new state path `.newTodoTitle`
3. Update `newTodoTitle` whenever user enters something in the `<input>`

We want to add a new todo to our `todosById` list whenever user presses `Enter`
key in the input. We could create an event handler in the view itself which does
this work, but Engine recommends we rather not. Only logic that should go into a
view is converting event payloads into value they contain, and store them at
some path in state.

We'll now add event listener for `onKeyDown` in the input, and store the pressed
key in state as `pressedTodoFormKey`. Make these changes in `src/TodoForm.tsx`:

```diff
const TodoForm: view = ({
  updateNewTodoTitle = Update.newTodoTitle,
  newTodoTitle = Observe.newTodoTitle,
+ updatePressedKey = Update.pressedTodoFormKey
}) => (
    <input
      className="new-todo"
      placeholder="What needs to be done?"
      autoFocus={true}
      value={newTodoTitle || ""}
      onChange={e => updateNewTodoTitle.set(e.currentTarget.value)}
+     onKeyDown={e => updatePressedKey.set(e.key)}
    />
  );
```

Using state as a communication mechanism between components and states allow us
to keep our views free of all logic. We get to create small producers which do
one thing well. `addNewTodo` is going to be one such producer for us. Make these
changes in `src/TodoForm.tsx`, we'll add a new producer:

```tsx
const addNewTodo: producer = ({
  pressedKey = Observe.pressedTodoFormKey,
  getTitle = Get.newTodoTitle,
  updateTodosById = Update.todosById,
  updateNewTodoTitle = Update.newTodoTitle
}) => {
  if (pressedKey !== "Enter") {
    return;
  }

  const id = String(new Date().getTime());
  const newTodo: TodoItem = {
    id,
    title: getTitle(),
    status: TodoStatuses.pending
  };

  updateTodosById.merge({
    [id]: newTodo
  });
  updateNewTodoTitle.set(null);
};
```

And add it to the list of `TodoForm`'s producers:

```diff
+ (TodoForm as any).producers = [addNewTodo];

export default TodoForm;
```

`addNewTodo` producer is doing a couple of interesting things:

1. We use `Get.newTodoTitle` instead of `Observe.newTodoTitle`.
   [Get](/docs/api/get) is another macro, which provides a function to get live
   value from the state. It is very useful when our producer is doing something
   asynchronous and needs a value from state at a later time. Or as is the case
   now, it allow us to access a value without `Observe`ing it. A `producer` or
   `view` gets triggered every time anything it `Observe` changes. We don't want
   `addNewTodo` producer to get called whenever `newTodoTitle` changes, we are
   only interested in changes in `pressedTodoFormKey`
2. We added a guard in starting of the producer, which checks if state is valid
   for execution of this producer. This is a common pattern in Engine apps,
   since it recommends creating small, single-responsibility producers. Here we
   check if the key user has pressed is the `Enter` key, if it isn't, we don't
   want to do anything in this producer.

In the spirit of single-responsibility producers, let's add another producer to
cancel adding a new todo if user presses Escape key.

```tsx
const cancelAddingTodo: producer = ({
  pressedKey = Observe.pressedTodoFormKey,
  updateNewTodoTitle = Update.newTodoTitle
}) => {
  if (pressedKey !== "Escape") {
    return;
  }

  updateNewTodoTitle.set(null);
};
```
Notice it has a guard similar to `addNewTodo`.

Adding it to `TodoForm.producers` will bring it to life:

```diff
- (TodoForm as any).producers = [addNewTodo];
+ (TodoForm as any).producers = [addNewTodo, cancelAddingTodo];
```

Although we can add new todos to our state, we can see the "Pending count"
increase in footer on adding new todos, but we still can't see them added to the
list. We have to update `visibleTodoIds` in our state, which is in charge of
which todos are visible in the list. Question is, where do the producer for
updating `visibleTodoIds` belong? Should we add a producer in `TodoForm` which
adds the todos, or should it go in `App`, which shows the list of todos?

Engine recommends that **Views which consume the derived state should track
it**. Let's add a producer in `src/App.tsx`:

```tsx
const syncVisibleTodoIds: producer = ({
  todosById = Observe.todosById,
  filter = Observe.filter,
  visibleTodoIds = Update.visibleTodoIds
}) => {
  const todoIdsToDisplay = Object.entries(todosById)
    .map(([key, value]) => {
      switch (filter as TodoFilters) {
        case TodoFilters.completed:
          return value.status === TodoStatuses.done ? key : null;
        case TodoFilters.pending:
          return value.status === TodoStatuses.done ? null : key;
        default:
          return key;
      }
    })
    .filter(Boolean);

  visibleTodoIds.set(todoIdsToDisplay);
};
```

This view is doing a bit more than just adding all the `id`s from `todosById`.
It also accounts for existence of a `filter` in state, which don't yet exist in
state. This is how **Engine help gradually evolving the state as application
evolves**. We'll set the filter when user clicks on "All", "Active" and
"Completed" buttons in the `Footer`. But before that, let's add this producer to
our `App`:

```diff
(App as any).producers = [syncVisibleTodoIds];

export default App;
```

Before we add filters to state, let's create an enum to represent all the
possible filters that our app can have. In `src/types.tsx`, add:

```ts
export enum TodoFilters {
  all = "all",
  completed = "completed",
  pending = "pending"
}
```

Making a very simply change to `src/Footer.tsx` allow us to set filters for
visible todos:

```diff
- import { TodoItem, TodoStatuses } from "./types";
+ import { TodoItem, TodoStatuses, TodoFilters } from "./types";

const Footer: view = ({
  pendingCount = Observe.pendingCount,
+ filter = Observe.filter,
+ updateFilter = Update.filter
}) => (
...
      <ul className="filters">
        <li>
-         <a href="#/" className="selected">All</a>
+         <a
+           href="#/"
+           className={filter === TodoFilters.all ? "selected" : ""}
+           onClick={() => updateFilter.set(TodoFilters.all)}
+         >
+          All
+         </a>
        </li>
        <li>
-         <a href="#/active">Active</a>
+         <a
+           href="#/active"
+           className={filter === TodoFilters.pending ? "selected" : ""}
+           onClick={() => updateFilter.set(TodoFilters.pending)}
+         >
+           Active
+         </a>
        </li>
        <li>
-         <a href="#/completed">Completed</a>
+         <a
+           href="#/completed"
+           className={filter === TodoFilters.completed ? "selected" : ""}
+           onClick={() => updateFilter.set(TodoFilters.completed)}
+         >
+           Completed
+         </a>
        </li>
      </ul>
```

We can also set an initial filter by setting it in our initial state in `src/index.tsx`:

```diff
+ import { TodoFilters } from "./types";
...
  state: {
    initial: {
+     filter: TodoFilters.all,
      todosById: {
```
