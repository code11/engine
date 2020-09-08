---
id: introducing-new-paths-in-state
title: Introducing new paths in state
sidebar_label: Introducing new paths in state
---

To make our `Todo`s editable, we want to toggle the component that is used to
display our TodoItem. Instead of rendering `title` in a `<label>`, an `<input>`
would serve our purpose of editing the title better. It's fair to say that our
`Todo` can be one of two modes at a time: "viewing" or "editing".

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

Now our `src/Todo/index.tsx` can simply be a logical component, which decides which
of its two modes to render. In `src/Todo/index.tsx`

 ```tsx
import React from "react";
import { view, Observe, Prop } from "@c11/engine.macro";
import View from "./View";
import Edit from "./Edit";
import { TodoModes } from "../types";

const Todo: view = ({ id, mode = Observe.todosById[Prop.id].mode }) => {
  const Component = mode === TodoModes.editing ? Edit : View;

  return <Component id={id} />;
};

export default Todo;
```
