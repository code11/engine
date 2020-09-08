---
id: state
title: State is King!
sidebar_label: State
---

Purpose of every software is to solve some real world problem. Data that we use
to represent the objects involved in the problem and the solution, are sometimes
called **Domain Objects**.

Every UI is just a representation of some data. Its purpose is to show this
data, and enable the user to intuitively make sense of, and change it. This data
that UI stores, operates on and represents, is called its **State**. A part of
the state is made up of Domain objects, and is refereed to as **essential
state**. Rest of the state is needed by the UI itself, and is called
**accidental state**. e.g storage of Todo items in a todo app is essential
state; data like which filter is active makes the accidental state.

Engine strongly recommends keeping a single source of truth for our
application's state. State of the app when it has just started up (aka initial
state) can be given to [Engine](/docs/api/engine) when it is instantiated:

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

Careful consideration must be given for what the shape of our state is going to
be, even for smaller applications. After all, habits maketh man.

Engine recommends storing our domain objects in some sort of indexed data
structure (e.g an `Object`), so we can have instant access to any domain object
using just its identifier. Later in this chapter we'll see that Engine has a
unique way to very efficiently utilize such state.

Domain objects often cross boundaries of different components of a software
product. For example, going from database to a backend application, to a
serialized form for network transfer (e.g JSON), to UIs. It is advisable to keep
them in a consistent representation across different components of our system.
Doing so builds intuition and confidence in the system.

Usually we would have a unique `id` field in our database, which can uniquely
identify a todo. Since we are building the UI only, we don't really have any
identifier for our todos. We'll fake that, and add a fake `id` into every todo
item our application creates.

Types are immensely helpful in modeling our domain objects. Let's create a
`src/types.ts` file, and add how our `TodoItem` is going to be shaped like:

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

Notice that for the status of our `TodoItem`s, we are using an enum of statuses
instead of a boolean flag (e.g `isDone` or `isPending`). It is an [Engine best
practice](/docs/best-practices#prefer-explicit-types-over-boolean-flags) to
prefer explicit types over boolean flags.

Now that we know how our `TodoItem`s are going to look like, let's add some
initial todos for our app. In `src/index.tsx`

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

We have kept our todo items in very explicitly named `todosById` key, and have
also added a `visibleTodoIds` array. One of our app components (Todo listing)
happen to show a list of todo items. These shown todos might (and will) end up
being different from our `todosById`. So we are keeping them in their own path
in state. Notice that instead of copying the entire todo item, we only keep the
`id` in `visibileTodoIds`. It's crucial for maintainability that we always
maintain a single source of truth for our data.

`todosById` will often be referred to in our app. Let's create a type alias for
it so we won't have to repeat it over and over again. In `src/types.ts`, add:

```ts
export type TodosById = { [id: string]: TodoItem };
```

It's time to show the `TodoItem`s from state in our component.
