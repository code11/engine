---
id: introduction
title: Introduction
sidebar_label: Introduction
---

### What is Code<sup>11</sup> Engine?

Engine is a web development framework which keenly focuses on developer
productivity. It lets you create robust web applications with unprecedented
simplicity.

### Goals

Engine strives to build applications with

- Small codebase. Less code, less bugs, more hairs still on head
- Less work for computer. Only compute what is needed for faster applications
- Less work for developer. Minimal API which gets out of developers way. Allows
  you to focus on the business problems, not Engine problems

### Principles

Instead of creating perfect bricks and sticking them together into "the perfect
application", **mold your application just like you would do with clay**. Let it
gradually evolve over time without any friction or constraints.

Engine is built with keeping real-world, evolving requirements in mind, and all
the challenges that come with it.

#### Dumb as brick Components

> A view is another representation of some data

Components are bricks of an Engine view as well, and they should be as dumb as
bricks. A component does not do anything except:

1. Render the view it is supposed to display
2. Change the data it is supposed to represent

#### Evolving Data

> At the core of every UI is a state

The clay of our applications is state. Although the core of the application,
state in engine is simply a plain old Javascript Object.

#### Reactive Computations

Dumb components, plain data, and computations capable of reacting to changes in
the data makes an Engine app.


Engine apps are reactive. We start with:
- an initial state (which can be empty as well)
- declare dumb components that represent some part(s) of state e.g a
  `TodoListItem` component which needs a `TodoItem` object from state
- declare computations that depend on some part(s) of state, e.g a `doneCounter`
  function which depends on all `TodoItems` in state

Engine takes care of updating the view, and re-running the computations only
when their dependencies from state change.

This is all the plumbing needed to build an Engine app!
