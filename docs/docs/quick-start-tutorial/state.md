---
id: state
title: State is King!
sidebar_label: State is King
---

Purpose of every software is to solve some real world problem. Data used to
represent the objects involved in the problem and the solution, are sometimes
called **Domain Objects**.

Every UI is just a representation of some data. Its purpose is to show this
data, and enable the user to intuitively make sense of, and change it. This data
that UI stores, operates on and represents, is called its **State**. A part of
the state is made up of Domain objects, and is refereed to as **essential
state**. Rest of the state is needed by the UI itself, and is called
**incidental state**. e.g storage of Todo items in a todo app is essential
state; data like which filter is active makes the accidental state.

Engine strongly recommends keeping a single source of truth for an application's
state. State of the app when it has just started up (aka initial state) can be
given to [Engine](/docs/api/engine) when it is instantiated:

```diff
const engine = new Engine({
+ state: {
+   initial: { }
+ },
  view: {
    element: <App />,
    root: "#root"
  }
});
```

Careful consideration must be given for what the shape of the state is going to
be, even for smaller applications. After all, habits maketh man.

Engine recommends storing our domain objects in some sort of indexed data
structure (e.g an `Object`), which allow instant access to any domain object
using just its identifier. As demonstrated in this chapter later, Engine has a
unique way to very efficiently utilize such structure.

Domain objects often cross boundaries of different components of a software
product. For example, going from database to a backend application, to a
serialized form for network transfer (e.g JSON), to UIs. It is advisable to keep
them in a consistent representation across different components of our system.
Doing so builds intuition and confidence in the system.

Usually there would be a unique `id` in the database which can uniquely identify
a todo. While building only the UI, such identifier isn't available. So the app
will add a fake `id` into every todo item it creates.

Types are immensely helpful in modeling domain objects. Create a `src/types.ts`
file, and add how the `TodoItem` is going to be shaped like:

```ts
export enum TodoStatuses {
  pending = "pending",
  done = "done"
}

export interface TodoItem {
  id: string;
  title: string;
  status: TodoStatuses;
}
```

Notice that for the status of `TodoItem`s, an enum of statuses is used instead
of a boolean flag (e.g `isDone` or `isPending`). It is an [Engine best
practice](/docs/best-practices#prefer-explicit-types-over-boolean-flags) to
prefer explicit types over boolean flags.

Knowledge of the shape of `TodoItem`s allows adding some initial todos the
application state. In `src/index.tsx`

```diff
const engine = new Engine({
  state: {
-   initial: { }
+   initial: {
+     todosById: {
+       todo1: { id: 'todo1', title: 'Add initial state to engine', isDone: false },
+       todo2: { id: 'todo2', title: 'Use initial state in components', isDone: false }
+     },
+     visibleTodoIds: ['todo1', 'todo2']
+   }
+ },
  view: {
    element: <App />,
    root: "#root"
  }
});
```

Todo items are kept in very explicitly named `todosById` key, and their `id`s
are also added in a `visibleTodoIds` array. One of the app components (Todo
listing) happen to show a list of todo items. These shown todos might (and will)
end up being different from our `todosById`. Keeping them in their own path in
state allows keeping a normalized state. It is crucial for maintainability that
a single source of truth for data is maintained.

`todosById` will often be referred to in the app. Create a type alias for it is
helpful to not have to repeat it over and over again. In `src/types.ts`, add:

```ts
export type TodosById = { [id: string]: TodoItem };
```

It's time to show the `TodoItem`s from state in our component.
