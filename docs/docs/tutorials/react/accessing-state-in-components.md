---
id: accessing-state-in-components
title: Accessing State in Components
sidebar_label: Accessing State
---

Converting a React Component to Engine [view](/docs/api/view) allow accessing
todos from state In `src/App.tsx`:

  ```diff
- const App = () => (
+ const App: view = ({ todoIds = observe.visibleTodoIds }) => (
    <section className="todoapp">
+     {console.log("TODOS", todoIds)}
```

1. `App` component is labeled as a `view`
2. In `App`'s header, `observe.visibileTodoIds` allow reading `State.visibileTodoIds`

Todos ids from state can be seen printed in console! Engine allow observing any
part of the state by assigning it as `observe.<path>` in header of a `view`.
All engine operator types are available globally. Check them out in `global.ts`.

Extract the `<Todo>` component out of`<App>` to easily `map` todo ids to`Todo`
components, and put it in its own file. In `src/Todo.tsx`, add

  ```tsx
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

Update the `App` component with:

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

As per the implementation of`Todo`, it is possible to see todo ids(i.e`todo1`,
  `todo2`) in browser. But it should actually show`TodoItem.title`, not their
  id.

This is where Engine differs from traditional React apps. Engine recommends that
[parent component should pass minimal data to its children](docs / best -
practices#pass - minimal - data - to - children). Minimum amount of data needed
to render a `Todo` is its `id`. Right todo can be retrieved from global state
with its id. Modify the `Todo` component to follow the Engine way:

In`src/Todo.tsx`

  ```diff
- const Todo = ({ id }) => (
+ const Todo: view = ({ title = observe.todosById[prop.id].title }) => (
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

1. `Todo` is converted to a [view](/docs/api/view) (by labeling it with `view` macro)
2. Assigning `title` to `observe.todosById[prop.id].title` in view header gives
   access to the title of a todo from the global state

[prop](/docs/api/prop) allow [composing
paths](/docs/concepts/path-composition) for accessing data from global
state. `prop.<path>` gives access to all the [React
props](https://reactjs.org/docs/components-and-props.html) passed to a component
by its parent.

Every `view` in Engine can access any data path from Engine's global state.
Trick is getting the right thing. The input macros help achieving clever ways of
**[path composition](/docs/concepts/path-composition)** to get the
right data into views.

`observe.todosById[prop.id].title` tells Engine to look-up a todo with `prop.id`
in `todosById` object of the global state, and observe its `title` property. This
gives read-only access to `title`.

This also ensures that the view gets re-rendered whenever `title` property of
todo with id `prop.id` changes. Any other changes that happen in the state, even
in the todo itself will not affect the view.
