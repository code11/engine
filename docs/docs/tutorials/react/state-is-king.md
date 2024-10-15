---
id: state-is-king
title: State is King!
sidebar_label: State is King
---

[State](/docs/concepts/state) of the app when it has just started up (aka
initial state) can be given to when it is
instantiated:

```diff
const app = engine({
+ state: {
+   initial: { }
+ },
  view: {
    element: <App />,
    root: "#root"
  }
});
```

Usually there would be a unique `id` in the database which can uniquely identify
a todo. While building only the UI, such identifier isn't available. So the app
will add a fake `id` into every todo item it creates.

Types are immensely helpful in modeling domain objects. Create a `src/types.ts`
file, and add how the `TodoItem` is going to be shaped like:

```ts
export enum TodoStatuses {
  pending = "pending",
  done = "done",
}

export interface TodoItem {
  id: string;
  title: string;
  status: TodoStatuses;
}
```

Notice that for the status of `TodoItem`s, an enum of statuses is used instead
of a boolean flag (e.g `isDone` or `isPending`). It is an [Engine best
practice](/docs/best-practices#prefer-explicit-types-for-defining-states) to
prefer explicit types over boolean flags.

Knowledge of the shape of `TodoItem`s allows adding some initial todos the
application state. In `src/index.tsx`

```diff
const app = engine({
  state: {
-   initial: { }
+    todosById: {
+      todo1: { id: 'todo1', title: 'Add initial state to engine', status: "pending", mode: "viewing" },
+      todo2: { id: 'todo2', title: 'Use initial state in components', status: "done", mode: "viewing" },
+      todo3: { id: 'todo3', title: 'Update state in components', status: "pending", mode: "editing" }
+     },
+     visibleTodoIds: ['todo1', 'todo2']
   },
  view: {
    element: <App />,
    root: "#root"
  }
});
```

Todo items are kept in very explicitly named `todosById` key, and their `id`s
are also added in a `visibleTodoIds` array. This a deliberate choice with [good
reasons](/docs/concepts/state#shape-of-state). One of the app components (Todo listing)
happens to show a list of todo items. These shown todos might (and will) end up
being different from our `todosById`. Keeping them in their own path in state
allows keeping a normalized state. It is crucial for maintainability that a
single source of truth for data is maintained.

`todosById` will often be referred to in the app. Create a type alias for it is
helpful to not have to repeat it over and over again. In `src/types.ts`, add:

```ts
export type TodosById = { [id: string]: TodoItem };
```

It's time to show the `TodoItem`s from state in our component.
