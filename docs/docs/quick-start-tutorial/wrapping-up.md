---
id: wrapping-up
title: Wrapping Up
sidebar_label: Wrapping Up
---

We have learned almost all the concepts needed to build Engine apps. There is a
bit more to Engine API, about which you can read in the [API
section](/docs/api/engine).

Let's wrap up by finishing our Todos app. Three last UI elements that left putting
life in are:
1. Clearing completed Todos
2. Toggling status of all Todos
3. Removing a todo item when "X" button in `Todo` is clicked

All these operations will follow the principles we have learned so far. A `view`
will accept user's input, and store it in our state, a `producer` will get
triggered and perform the actual operation.

## Clearing completed Todos

Since removing Todo's is a new operation (i.e isn't an instance of deriving our
state to shape it differently), we'll keep the producer responsible for it
closer to the view that will trigger the producer.

In `src/Footer.tsx`, let's add a click event listener for "Clear Completed"
todos button. Our view is going to use state as a communication channel to
trigger the producer (as discussed in [last
chapter](/docs/quick-start-tutorial/state-as-communication-channel)).

```diff
const Footer: view = ({
  pendingCount = Observe.pendingCount,
  filter = Observe.filter,
  updateFilter = Update.filter,
+ updateClearRequest = Update.clearRequest
}) => (
...
-     <button className="clear-completed">Clear completed</button>
+     <button
+       className="clear-completed"
+       onClick={() => updateClearRequest.set(new Date().getTime())}
+     >
        Clear completed
    </button>
```

We have introduced a new path in our state, `clearRequest`, which will contain a
value when a clear operation need to be performed. In same file (i.e
`src/Footer.tsx`), we'll now add a new producer which performs the actual
operation of clearing completed todos.

```tsx
const handleClearRequest: producer = ({
  clearRequest = Observe.clearRequest,
  updateClearRequest = Update.clearRequest,
  getTodosById = Get.todosById,
  updateTodosById = Update.todosById
}) => {
  if (!clearRequest) {
    return;
  }

  const todosById = getTodosById();
  const nextTodos = Object.values(todosById)
    .filter((todo: any) => todo.status !== TodoStatuses.done)
    .reduce((accum: any, todo: any) => {
      accum[todo.id] = todo;

      return accum;
    }, {});

  updateTodosById.set(nextTodos);
  updateClearRequest.set(null);
};
```

We'll add it to `Footer`'s producers:

```tsx
- (Footer as any).producers = [pendingCounter];
+ (Footer as any).producers = [pendingCounter, handleClearRequest];
```

Notice how `handleClearRequest` producer is changing the value that acts as its
trigger. This is also a common pattern in Engine apps.

## Toggling status of all Todos

Similarly, to toggle status of all Todos, we'll store a new path in state to
when the "Toggle All" checkbox is clicked, and we'll create a producer that gets
triggered to do the actual work.

In `src/App.tsx`, let's create store the value in state:

```diff
- const App: view = ({ todoIds = Observe.visibleTodoIds }) => (
+ const App: view = ({
+   pendingCount = Observe.pendingCount,
+   todoIds = Observe.visibleTodoIds,
+   updateToggleAllRequest = Update.toggleAllRequest
+ }) => (
...
-       <input id="toggle-all" className="toggle-all" type="checkbox" />
+       <input
+         id="toggle-all"
+         className="toggle-all"
+         type="checkbox"
+         checked={pendingCount === 0}
+         onChange={() => updateToggleAllRequest.set(new Date().getTime())}
+       />
```

Add a new producer `handleToggleAllRequest`:

```tsx
const handleToggleAllRequest: producer = ({
  toggleAllRequest = Observe.toggleAllRequest,
  updateToggleAllRequest = Update.toggleAllRequest,
  getTodosById = Get.todosById,
  getPendingCount = Get.pendingCount,
  updateTodosById = Update.todosById
}) => {
  if (!toggleAllRequest) {
    return;
  }

  const todosById = getTodosById() as TodosById;
  const pendingCount = getPendingCount();

  const nextTodos = Object.values(todosById)
    .map(todo => {
      return {
        ...todo,
        status: pendingCount !== 0 ? TodoStatuses.done : TodoStatuses.pending
      };
    })
    .reduce((accum, todo) => {
      accum[todo.id] = todo;

      return accum;
    }, {} as TodosById);

  updateTodosById.set(nextTodos);
  updateToggleAllRequest.set(null);
};
```

Add it to `App`'s producers:

```diff
- (App as any).producers = [syncVisibleTodoIds];
+ (App as any).producers = [syncVisibleTodoIds, handleToggleAllRequest];
```

## Removing Todos

Check out the documentation for [Update](/docs/api/update), and try to implement
this feature in by yourself 🙂

<details>
<summary>Solution</summary>

In `src/Todo/View.tsx`,

```diff
-       <button className="destroy" />
+       <button className="destroy" onClick={() => updateTodo.remove()} />
```
</details>
