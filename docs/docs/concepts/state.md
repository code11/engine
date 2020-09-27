---
id: state
title: State
sidebar_label: State
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
state; data like which filter is active makes the incidental (also sometimes
called "accidental") state.

Engine strongly recommends keeping a single source of truth for an application's
state. State of the app when it has just started up (aka initial state) can be
given to [Engine](/docs/implementations/react) when it is instantiated:

```diff
const engine = new Engine({
  state: {
    initial: { }
  },
  view: {
    element: <App />,
    root: "#root"
  }
});
```

## Shape of State

Careful consideration must be given for what the shape of the state is going to
be. Engine recommends storing our domain objects in some sort of indexed data
structure (e.g an `Object`), which allow instant access to any domain object
using just its identifier. Through [path
composition](/docs/concepts/path-composition), Engine provides a unique way to
very efficiently utilize such structure.

Domain objects often cross boundaries of different components of a software
product. For example, going from database to a backend application, to a
serialized form for network transfer (e.g JSON), to UIs. It is advisable to keep
them in a consistent representation across different components of our system.
Doing so builds intuition and confidence in the system.


## Initial state

*Initial state* is the state with which an application is going to start.
Usually we define some defaults for many of our state data in initial state.
