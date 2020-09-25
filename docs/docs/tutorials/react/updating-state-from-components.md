---
id: updating-state-from-components
title: Updating State from Components
sidebar_label: Updating State
---

Rendering our state in components is one piece of the puzzle, another piece is
manipulating state from components. Changes below make it possible to toggle the
status of `Todo`s.

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

Above snippet:
1. Uses `Observe.todosById<todoId>.status` for deciding whether the checkbox for
   the `Todo` is checked or not
2. Uses `Update.todosById<todoId>.status` to change status of the TodoItem.
   [Update](/docs/api/update) is the dual of [Observe](/docs/api/observe).
   Observe allows reading any value from the global state, Update allows
   changing them. `Update.<path>` returns an object with a number of methods to
   conveniently work with our state. You can read [more about Update in api
   docs](/docs/api/update).

## Many faced component

To make the `Todo`s editable, the HTML elements that are used to display the
TodoItem need to be changed. Instead of rendering `title` in a `<label>`, an
`<input>` serves the purpose of editing the title better. It's fair to say that
`Todo` can be in one of two modes at a time: "viewing" or "editing".

Create an enum for all different modes a Todo can be in. In `src/types.tsx`:

```diff
+ export enum TodoModes {
+   viewing = "viewing",
+   editing = "editing"
+ }
```

Also update the type for `TodoItem` to support TodoMode. In `src/types.tsx`:

```diff
export interface TodoItem {
  id: string;
  title: string;
  status: TodoStatuses;
+ mode: TodoModes;
}
```

In such scenarios, Engine recommends that views should be split into different
States. Go ahead and create two versions for our `Todo` component for the two
states it can be in. For better separation of related code, different states of
`Todo` component are put in their own files.

Rename `src/Todo.tsx` to `src/Todo/index.tsx`

This will not need a change in other components which import `Todo` (i.e `App`),
and gives a directory to nicely keep `Todo.View` and `Todo.Edit` close together.

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

`Todo.tsx` view is practically renamed to `Todo/View.tsx`

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

`src/Todo/index.tsx` can simply be a logical component which decides the
appropriate view based on Todo's state. In `src/Todo/index.tsx`

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

This explicitly calls out how different todo modes correspond to different
components, and adds a safe fallback in case our Todo is in an invalid state.
Safest fallback is one which is least error prone. In this case, it is simply to
render nothing.

Update todo items in initial state to also have a mode. In `src/index.tsx`

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

Change `TodoItem.mode` of todos in state whenever user double clicks a
`Todo.View`. In `src/Todo/View.tsx`:

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

Above snippet:
1. Changed `Update` from `Update.todosById[Prop.id].status` to
   `Update.todosById[Prop.id]`. Since we want to update more than just status of
   a Todo, it's better to minimize our component's API surface and get an
   [Update](/docs/api/update) for the whole Todo item
2. Updates the method of changing status of the todo is updated as a consequence of #1
3. Adds an event-listener to change the mode of Todo when user double-clicks
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

Next section introduces [Producer](/docs/api/producer)s, which are another core
concept of Engine.
