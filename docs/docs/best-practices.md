---
id: best-practices
title: Best Practices
sidebar_label: Best Practices
---

### Use Global state as a single source of truth

An instance of [Engine](/docs/api/engine) can have a single
global state, and it is recommended to use that as the single source of truth
for all the data required by all components of an application.

### Keep a normalized state

Same data should not be kept in more than one paths in state.

### Pass minimal data to children

Parent component should pass minimum amount of data to its children. Ideally, no
data should be passed to a component's children. Children are responsible for
observing the data they need from global state.

### Component which needs the data, maintains the data

When different components need same data in different shapes, e.g `TodoFooter`
needs a to show number of pending `TodoItem`s, it is the responsibility of
`TodoFooter` to have a producer which provides `pendingCount` by counting
`TodoItem.status === 'pending'` from state.

### Use Object to store domain objects instead of Array

Domain objects are the critical business objects we have modeled to solve the
business problems with our software. It is recommended to keep domain objects in
`Object` e.g `todosById: { [id: string]: TodoItem }`.

This is a good practice in general, and Engine provides nice optimizations for
this pattern. When a list of such objects is needed, a producer should be
created to create and update a list of `id`s.

### Prefer explicit types over boolean flags

Instead of using boolean flags, e.g `isDone` and `isEditing`, prefer using
explicit types, e.g

```ts
enum Statuses {
  done: "done",
  pending: "pending"
}

enum Modes {
  viewing: "viewing",
  editing: "editing"
}
```

When using an `Enum`, prefer using a string Enum.

### Producers:
- only one producer per file
- they should have a descriptive name (camelCase) and the file should have the same name
- they should do only one thing
- they should use `get` instead of `observe` if you don’t need that value to retrigger the producer
- in the folder structure they should stay close to the components that use them. 
- if there are more than one producer for a component the propper way of **importing** them should be to by creating an `index.js/ts` file in the producers folder and export them all there and in the component write like this
``` import * as producers from "./producers";
...
<Component>.producers(Object.values(producers)); 
```
- if you use typescript keep using the types throughout the entire producer (use type casting if needed)

### Components:
- only one component per file
- they should have a descriptive name (PascalCase) and the file should have the same name
- they should do only one thing
- they should use `get` instead of `observe` if you don’t need that value to retrigger the component
- the use of layout components is highly encourage (cards, sidebars, navbars)
- use as few props as posible, they should get their data from the state
- if they have sub-components they can be put in a `./component` folder on the same level
- they should be used only for **displaying** data or as **layout component** so they should manipulate the data as litle as posible
- they can only change the state by:  
  - triggering a producer (they can even pass simple date to the producers)
  - they can also change the state directly but the changed data should be at most on the same level in the state hierarchy as the component's data is (e.g. checkbox component)
- they can have inline style (tailwind or styled-components) and if they use .css that file should be put in the same folder
- if a component is use in multiple places they should be put in a `generalComponents` upper in the folder hierarchy

