---
id: testing
title: Testing
sidebar_label: Testing
---

Engine gives a lot of emphasis to building testable applications. Recommended
way to test Engine applications is using `@c11/engine.test` package, which can
be installed like any other npm package.

```sh
npm install -D @c11/engine.test jest
```

`@c11/engine.test` provides utilities for writing tests which can be used with
the [jest](https://jestjs.io/) testing framework. Jest is the only Engine supported
testing framework for now.

Engine applications are combinations of [views](/docs/api/view) and
[producers](/docs/api/producer). Naturally, unit testing Engine applications is
achieved by writing unit tests for its `producer`s and `view`s.

```ts
import Test from "@c11/engine.test";
```

Like rest of Engine ecosystem, API exposed by `@c11/engine.test` is also quite
minimal. Default export from `@c11/engine.test` has just 2 properties which can
be used to test [producer](/docs/api/producer)s and [view](/docs/api/view)s.

## Testing `producer`s

Engine `producer`s are just Javascript functions. Testing them boils down to
same rules that apply to testing functions. Only catch is the fact that it is
not possible to call producers directly. They are executed by
[Engine](/docs/api/engine) automatically when something interesting in state
changes. `Test.producer` is a convenience function which works around this
catch, and makes testing a breeze.

### `Test.producer`

`Test.producer` is a replacement for
[test/it](https://jestjs.io/docs/en/api#testname-fn-timeout) calls. A call to
`Test.producer` tests a single attribute (or function call) of a producer,
making a single test case for a producer's test suite. For example, here's what
a test suite for a producer with single test looks like:

```ts
describe("editListItem", () => {
  Test.producer("Guard action doesn't exist", {
    producer: editListItem,
    values: {},
    expectations: {
      resetAction: {
        set: [],
      },
      updateMode: {
        set: [],
      },
    },
  });
});
```

Unlike [test/it](https://jestjs.io/docs/en/api#testname-fn-timeout),
`Test.producer` don't take a function where arbitrary logic and assertions can
go. `Test.producer` takes an object as its argument, which has following properties:

- **`producer: producer`**

  The [producer](/docs/api/producer) function which you want to test.

- **`values: object`**

  `values` is an object that represent the first argument of the producer. We
  can't call the producer directly to test it, `values` is how we:

  1. Provide arguments which producer gets from state (e.g using `Observe.<path>`)
  2. Provide mocks for functions and other abstractions the producer uses

  When the test is executed, the producer will get called with these `values` as
  argument.

- **`expectations: { set: object, merge: object, remove: object }`**

  Expectations is an object to declare our the behavior of our expectations in a
  declarative manner. Unlike traditional jest tests, we can't make arbitrary
  assertions in our tests to ensure our producer behaves. `expectations` is an
  object with three properties which can assert three ways in which a producer
  can impact the state:

  - **`set: object`** asserts new values that producer adds to state
  - **`merge: object`** asserts changes in existing values in state that
    producer has introduced
  - **`remove: object`** asserts values that producer has removed from the state

## Testing `view`s

Engine's `view`s are just producers with a significant specialty: they return
JSX which gets rendered in, well, a view. `@c11/engine.test` support testing
views with `Test.view` function. For now, only [snapshot
testing](https://jestjs.io/docs/en/snapshot-testing) is supported to test views.

### **`Test.view`**

Similar to `Test.producer`, `Test.view` is how individual tests of a
[view](/docs/api/view)'s test suite are written.

Here's what a simple test for a view looks like:

```ts
describe("TodoList view", () => {
  Test.view("no list", {
    state: {
      todo: {
        byId: {},
      },
    },
    View: TodoList,
    props: { icons: {} },
  });
});
```

Just like `Test.producer`, `Test.view` do not accept a function for its second
argument but an object to declare the test in a declarative manner.

- **`state: Object`**

  `state` is the application state at the time when view is first rendered.
  Testing a view need access to the whole state because:

  1. Child views might be accessing this state directly
  2. Producers attached to the view (or its child views) might make changes to
     the application state, which in turn impact the view

- **`View: view`**

  `View` is the view itself that the test is being written for.

- **`props: object`**

  `props` is an object of props that parent view has passed down.

This is all that is needed to test an Engine view. A call to `Test.view` will
take a snapshot of how the view looks like when rendered in browser, and match
it with the previously taken snapshot to ensure nothing has broken the view. You
can read more about [snapshot testing on Jest's
documentation](https://jestjs.io/docs/en/snapshot-testing).
