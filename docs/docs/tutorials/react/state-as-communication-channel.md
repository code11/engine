---
id: state-as-communication-channel
title: State as Communication Channel
sidebar_label: State as Communication Channel
---

It's time to make it possible to add new `TodoItem`s to the state. To start off,
extract `TodoForm` view out of `src/App.tsx`. Create a new file
`src/TodoForm.tsx` with following contents:

```tsx
const TodoForm = () => (
  <input
    className="new-todo"
    placeholder="What needs to be done?"
    autoFocus={true}
  />
);

export default TodoForm;
```

Update `src/App.tsx` accordingly:

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

Since global-state is the only kind of state recommended in Engine, a state
variable should be kept for what user is typing in our `TodoForm` input. Update
`src/TodoForm.tsx` to make its content be:

```tsx
const TodoForm: view = ({
  updateNewTodoTitle = update.newTodo.title,
  newTodoTitle = observe.newTodo.title,
}) => (
  <input
    className="new-todo"
    placeholder="What needs to be done?"
    autoFocus={true}
    value={newTodoTitle || ""}
    onChange={(e) => updateNewTodoTitle.set(e.currentTarget.value)}
  />
);

export default TodoForm;
```

Above snippet:

1. Labeled `TodoForm` as `view`, so that it can use [observe](/docs/api/observe)
   and [update](/docs/api/update) in its header
2. Introduced a new state path `.newTodo.title`
3. Update `newTodo.title` whenever user enters something in the `<input>`

A new todo should be added to the `todosById` object whenever user presses
`Enter` key in the input. It is possible to create an event handler in the view
itself which does this work, but Engine recommends to not do it from the `view`.
Only logic that should go into a view is converting event payloads into value
they contain, and store them at some path in state. All the business logic
belongs in [producer](/docs/api/producer)s.

Next steps are to:

1. Add event listener for `onKeyDown` in the input
2. Convert the pressed key to the intent TodoForm want to express, and store it
   in the state
3. Create producers for committing and discarding the new todo

In `src/TodoForm.tsx`:

```diff
+ import { TodoItem, TodoStatuses, TodoModes } from "./types";

+ enum NewTodoIntents {
+  commit = "commit",
+  discard = "discard"
+}

const TodoForm: view = ({
  updateNewTodoTitle = update.newTodo.title,
  newTodoTitle = observe.newTodo.title,
+  updateNewTodoIntent = update.newTodo.intent
}) => {
+  const keyDownToIntent = (e) => {
+    if (e.key === "Enter") {
+      updateNewTodoIntent.set(NewTodoIntents.commit);
+    }

+    if (e.key === "Escape") {
+      updateNewTodoIntent.set(NewTodoIntents.discard);
+   }
+  };

  return (
    <input
      className="new-todo"
      placeholder="What needs to be done?"
      autoFocus={true}
      value={newTodoTitle || ""}
      onChange={e => updateNewTodoTitle.set(e.currentTarget.value)}
+      onKeyDown={keyDownToIntent}
    />
  );
};
```

`view`s can contain as much logic as required to provide a clean API. A view's
API is made up of two things:

1. Its input: props and global state
2. Its output: JSX and global state

A good API do not reveal its implementation details. State shouldn't need to
know which key is getting pressed, but only what is the objective that a view
want to accomplish. To provide a clean API, an event listener can be created in
the view itself, which stores the intent of the TodoForm component in state in
`.newTodo.intent`.

Using state as a communication mechanism between components and producers allows
keeping the views free of all business logic, which is kept in small producers
which do one thing well. `addNewTodo` is going to be one such producer. Make
these changes in `src/TodoForm.tsx` to create a new producer:

```tsx
const addNewTodo: producer = ({
  newTodoIntent = observe.newTodo.intent,
  getTitle = get.newTodo.title,
  updateTodosById = update.todosById,
  updateNewTodoTitle = update.newTodo.title,
  updateNewTodoIntent = update.newTodo.intent
}) => {
  if (newTodoIntent !== NewTodoIntents.commit) {
    return;
  }
  updateNewTodoIntent.remove();
  const title = getTitle.value().trim();
  if (!title) return;
  const id = String(new Date().getTime());
  const newTodo: TodoItem = {
    id,
    title,
    status: TodoStatuses.pending,
    mode: TodoModes.viewing,
  };

  updateTodosById.merge({
    [id]: newTodo,
  });
  updateNewTodoTitle.set(null);
};
```

And add it to the list of `TodoForm`'s producers:

```diff
+ TodoForm.producers([addNewTodo]);

export default TodoForm;
```

`addNewTodo` producer is doing a couple of interesting things:

1. It uses `get.newTodo.title` instead of `observe.newTodo.title`.
   [get](/docs/api/get) is another macro, which provides a function to get live
   value from the state. It is very useful when our producer is doing something
   asynchronous and needs a value from state at a later time. Or as is the case
   now, it allow accessing a value without `observe`ing it.

   A `producer` or `view` gets triggered every time anything it `observe`
   changes. `addNewTodo` producer should not get called whenever `newTodo.title`
   changes. It is only interested in changes in `newTodoIntent`

2. Notice that a guard has been added in starting of the producer, which checks
   if state is valid for execution of this producer. This is a common pattern in
   Engine apps, since it recommends creating small, single-responsibility
   producers. The guard checks if the intent of newTodo is to commit it, if it
   isn't, this producer should not do anything.

In the spirit of single-responsibility producers, another producer can be
created to cancel adding a new todo if user presses Escape key.

```tsx
const cancelAddingTodo: producer = ({
  newTodoIntent = observe.newTodo.intent,
  updateNewTodoTitle = update.newTodo.title,
  updateNewTodoIntent = update.newTodo.intent
}) => {
  if (newTodoIntent !== NewTodoIntents.discard) {
    return;
  }
  updateNewTodoIntent.remove();
  updateNewTodoTitle.set(null);
};
```

Notice it has a guard similar to `addNewTodo`.

Adding it to `TodoForm.producers` will bring it to life:

```diff
- TodoForm.producers([addNewTodo]);
+ TodoForm.producers([addNewTodo, cancelAddingTodo]);
```

Although new todos are getting added to the state, and "Pending count" in footer
increases on adding new todos, new todos are not shown in the todo list.
`visibleTodoIds` in the state need to be kept in sync with changes in
`todosById`. It is in charge of which todos are visible in the list. Question
is, where do the producer for updating `visibleTodoIds` belong? Should a
producer be added in `TodoForm`, which adds the todos, or should it go in `App`,
which shows the list of todos?

Engine recommends that **views which consume the derived state should track
it**. Add a producer in `src/App.tsx`:

```tsx
const syncVisibleTodoIds: producer = ({
  todosById = observe.todosById,
  filter = observe.filter,
  visibleTodoIds = update.visibleTodoIds,
}) => {
  const todoIdsToDisplay = Object.entries(todosById as TodosById)
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
evolves**. The filter will be set later, when user clicks on "All", "Active" and
"Completed" buttons in the `Footer`. But before that, add this producer to
`App`:

```diff
App.producers([syncVisibleTodoIds]);

export default App;
```

Before adding filters to state, let's create an enum to represent all the
possible filters. In `src/types.tsx`, add:

```ts
export enum TodoFilters {
  all = "all",
  completed = "completed",
  pending = "pending",
}
```

Making a very simply change to `src/Footer.tsx` allows setting filters for
visible todos:

```diff
- import { TodoItem, TodoStatuses } from "./types";
+ import { TodoItem, TodoStatuses, TodoFilters } from "./types";

const Footer: view = ({
  pendingCount = observe.pendingCount,
+ filter = observe.filter,
+ updateFilter = update.filter
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

It's also possible to set an initial filter by setting it in the initial state.
In `src/index.tsx`:

```diff
+ import { TodoFilters } from "./types";
...
  state: {
    initial: {
+     filter: TodoFilters.all,
      todosById: {
```
