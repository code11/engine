---
id: updating-state-from-components
title: Updating State from Components
sidebar_label: Updating State
---

Rendering our state in components is one piece of the puzzle, another piece is
manipulating state from components. Let's make it possible to toggle the status
of our `Todo`s.

In `src/Todo.tsx`,

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

## Many faced component

To make our `Todo`s editable, we want to toggle the component that is used to
display our TodoItem. Instead of rendering `title` in a `<label>`, an `<input>`
would serve our purpose of editing the title better. It's fair to say that our
`Todo` can be one of two modes at a time: "viewing" or "editing".

We'll first create an enum for all different modes a Todo can be in. In
`src/types.tsx`:

```diff
+ export enum TodoModes {
+   viewing = "viewing",
+   editing = "editing"
+ }
```

While we are at it, let's also update the type for `TodoItem` to support
TodoMode. In `src/types.tsx`:

```diff
export interface TodoItem {
  id: string;
  title: string;
  status: TodoStatuses;
+ mode: TodoModes;
}
```

In such scenarios, Engine recommends that we split our component into different
States. Let's go ahead and create two versions for our `Todo` component for the
two states it can be in. For better separation of related code, we'll put
different states of `Todo` component in their own files.

Rename `src/Todo.tsx` to `src/Todo/index.tsx`

This won't make a difference for other components which import `Todo` (i.e
`App`). It'll give us a directory to keep `Todo.View` and `Todo.Edit` close
together.

Create `src/Todo/View.tsx` with following contents
```tsx
import React from "react";
import { view, Observe, Prop, Update } from "@c11/engine.macro";
import { TodoStatuses } from "../types";

const View: view = ({
  title = Observe.todosById[Prop.id].title,
  status = Observe.todosById[Prop.id].status,
  updateStatus = Update.todosById[Prop.id].status
}) => (
    <li>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={status === TodoStatuses.done}
          onChange={() =>
            updateStatus.set(
              status === TodoStatuses.done
                ? TodoStatuses.pending
                : TodoStatuses.done
            )
          }
        />
        <label>{title}</label>
        <button className="destroy" />
      </div>
    </li>
  );

export default View;
```

We have moved what was our `Todo.tsx` component, to `Todo/View.tsx`

For the editing mode of `Todo`, create `src/Todo/Edit.tsx`:
```tsx
import React from "react";
import { view, Observe, Prop, Update } from "@c11/engine.macro";

const Edit: view = ({
  title = Observe.todosById[Prop.id].title,
  updateTodo = Update.todosById[Prop.id]
}) => (
    <li className="editing">
      <input
        className="edit"
        value={title}
        onChange={e => updateTodo.merge({ title: e.currentTarget.value })}
      />
    </li>
  );

export default Edit;
```

Now our `src/Todo/index.tsx` can simply be a logical component which decides the
appropriate component based on Todo's state. In `src/Todo/index.tsx`

 ```tsx
import React from "react";
import { view, Observe, Prop } from "@c11/engine.macro";
import View from "./View";
import Edit from "./Edit";
import { TodoModes } from "../types";

const uiStates = {
  [TodoModes.editing]: Edit,
  [TodoModes.viewing]: View
};

const Fallback = ({ id }: { id: string }) => {
  console.warn("Invalid UI State for Todo with Id", id);

  return null;
};

const Todo: view = ({ id, mode = Observe.todosById[Prop.id].mode }) => {
  const Component = uiStates[mode as TodoModes] || Fallback;

  return <Component id={id} />;
};

export default Todo;
```

We have explicitly called out how different todo modes correspond to different
components, and added a safe fallback in case our Todo is in an invalid state.
Safest fallback is one which is least error prone, in this case, it is simply to
render nothing.

We'll have to modify our bootstrap todo items in initial state to also have a
mode. In `src/index.tsx`

```diff
      todosById: {
        todo1: {
          id: "todo1",
          title: "Add initial state to engine",
          isDone: false,
+         mode: "viewing"
        },
        todo2: {
          id: "todo2",
          title: "Use initial state in components",
          isDone: false,
+         mode: "viewing"
        }
      },
```

Let's now change `TodoItem.mode` of our todos in state whenever user double
clicks a `Todo.View`. In `src/Todo/View.tsx`:

```diff
+ import { TodoModes } from "../types";
...
const View: view = ({
  title = Observe.todosById[Prop.id].title,
  status = Observe.todosById[Prop.id].status,
- updateStatus = Update.todosById[Prop.id].status
+ updateTodo = Update.todosById[Prop.id]
}) => (
    <li>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={status === TodoStatuses.done}
          onChange={() =>
-           updateStatus.set(
-             status === TodoStatuses.done
-               ? TodoStatuses.pending
-               : TodoStatuses.done
-           )
+           updateTodo.merge({
+             status:
+               status === TodoStatuses.done
+                 ? TodoStatuses.pending
+                 : TodoStatuses.done
+           })
          }
        />
-       <label>{title}</label>
+       <label
+         onDoubleClick={() => updateTodo.merge({ mode: TodoModes.editing })}
+       >
+         {title}
+       </label>
```

We have:
1. Changed `Update` from `Update.todosById[Prop.id].status` to
   `Update.todosById[Prop.id]`. Now that we want to update more than just status
   of a Todo, it's better to minimize our component's API surface and get an
   [Update](/docs/api/update) for the whole Todo item
2. As a result of #1, we update how we used to change status of our todo
3. We added an event-listener to change the mode of Todo when user double-clicks
   the todo title

Update `src/Todo/Edit.tsx` so Todo can switch back to `viewing` mode:

```diff
+ import { TodoModes } from "../types";
...
      <input
        className="edit"
        value={title}
        onChange={e => updateTodo.merge({ title: e.currentTarget.value })}
+       onBlur={() => updateTodo.merge({ mode: TodoModes.viewing })}
      />
```

There are some rough edges we still need to polish up for `Todo` component,
which we'll get back to once we have familiarized ourselves with Producers in
next step.
