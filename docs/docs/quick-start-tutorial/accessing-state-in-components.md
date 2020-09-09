---
id: accessing-state-in-components
title: Accessing State in Components
sidebar_label: Accessing State
---

First we'll check if we can access todos from our state in `src/App.tsx`:

  ```diff
import React from "react";
+ import { view, Observe } from "@c11/engine.macro";
+
- const App = () => (
+ const App: view = ({ todoIds = Observe.visibleTodoIds }) => (
    <section className="todoapp">
+     {console.log("TODOS", todoIds)}
```

1. We labeled our`App` component as a `view`
2. We assigned`Observe.visibileTodoIds` in first argument of`App` view

We can see todos ids from our state printed in console! Engine allow us to
observe any part of our state by assigning it as `Observe.<path>` in `view`
argument.

Time to put these todos in jsx.In`src/App.tsx`, let's extract the `<Todo>`
component out of`<App>` so that we can easily do `map` these ids to`Todo`
components.We'll put `Todo` in its own file. In `src/Todo.tsx`, add

  ```tsx
import React from "react";

const Todo = ({ id }) => (
  <li>
    <div className="view">
      <input className="toggle" type="checkbox" />
      <label>{id}</label>
      <button className="destroy" />
    </div>
  </li>
);

export default Todo;
```

Now we can update our`App` component with:

```diff
+ import Todo from './Todo';
...
      <ul className="todo-list">
-       <li>
-         <div className="view">
-           <input className="toggle" type="checkbox" />
-           <label>Give life to my TODOs</label>
-           <button className="destroy" />
-         </div>
-       </li>
+       {todoIds.map((id: string) => (
+         <Todo id={id} key={id} />
+       ))}
      </ul>
```

As per our implementation of`Todo`, we can now see todo ids(i.e`todo1`,
  `todo2`) in browser.But we want to show`TodoItem.title` in `Todo` component,
    not their id.

This is where Engine differs from traditional React apps.Engine recommends that
[parent component should pass minimal data to its
children](docs / best - practices#pass - minimal - data - to - children).Minimum amount of
data needed to render a`Todo` is its`id`.We can find the right todo from
global state if we know its id.Let's modify our `Todo` component to follow the
Engine way:

In`src/Todo.tsx`

  ```diff
+ import { view, Observe, Prop } from "@c11/engine.macro";
+
- const Todo = ({ id }) => (
+ const Todo: view = ({ title = Observe.todosById[Prop.id].title }) => (
  <li>
    <div className="view">
      <input className="toggle" type="checkbox" />
-     <label>{id}</label>
+     <label>{title}</label>
      <button className="destroy" />
    </div>
  </li>
);
```

1. We labeled`Todo` as a[view](/docs/api / view)
2. We assigned`title` to`Observe.todosById[Prop.id].title`, which gave us
access to the title of todos from our global state.

   [Prop](/docs/api / input - macros / prop) is one of few features exported by
Engine, which allow us to compose paths for accessing data from global state.
   `Prop.<key>` gives us access to all the[React
   props](https://reactjs.org/docs/components-and-props.html) passed to our
  component by its parent.

  Every `view` in Engine can access any data path from Engine's global state.
Trick is how to get the right thing.The input macros help to achieve clever
ways of ** path composition ** to get the right data into our components.

When we do `Observe.todosById[Prop.id].title`, we are telling Engine to
look - up a todo with `Prop.id` on`todosById` object of our global state, and
observe its`title` property.This gives us read - only access to`title`.

This will also ensure that our component gets re - rendered whenever`title`
property of todo with id`Prop.id` changes.Any other changes that happen in
  the state, `todosById`, or even the todo with id`Prop.id` won't affect our
component.
