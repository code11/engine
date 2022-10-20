---
id: get
title: get
sidebar_label: get
---

`get.<path>` retrieve values from the state without adding a listener.

It should be used for data that is required during execution but that does not trigger the execution (as opposed to [observe](/docs/api/observe)).

A `get` can be **lazy** or **eager** depending on whether the value should be available at the moment when the execution starts or at a later point in time.

A **lazy** `get` will return an API through which values can be retrieved and an **eager** `get` will provide the values when the execution starts.

Example:
```ts
const doSomeWork: producer = ({
  eager = get.foo.bar.value(),
  lazy = get.foo.bar
}) => {
  eager; // [1, 2, 3]
  setTimeout(() => {
    lazy.value(); // [1, 2, 3]
  }, 1000);
}
```
## API

A **lazy** `get.<path>` returns an object with following properties:

1. `.value(params?: object)` returns the date stored at that `<path>`
   `params` is an optional object argument, the keys of which set the
   [param](/docs/api/param)s.
2. `.includes(value: any, params?: object)` if the value at the given
   `<path>` is an array or a string, it returns a boolean if the provided
   `value` exists at that `<path>`
3. `.length(params?: object)` if the value at the given `<path>` is an `array`,a `string`, or a `function` it returns the length property

For the `value` getter method, if the stored data is serializable (e.g a primitive
Javascript type, a plain object), a copy of the data is returned. However, if
the data is not serializable (e.g a class instance, function etc), a reference
to it is returned.

## Best practices

1. Use more `gets` than `observes` in producers.

    Producers should have a very narrow window for triggering and the `observe` should be reserved for the triggering specificity. When you can't justify that some data determines the triggering then that data should be retrieved using a `get`.

2. `views` should not use `get`.

    Views should be completely reactive and always rely on fresh data to re-render.

    The only valid exception is regarding handling a user event (like a `click`)
    which is outside rendering.
    ```ts
    // DON'T DO THIS!
    const a: view = ({ a = get.a }) => <div>{a.value()}</div>

    // DON"T DO THIS!
    const b: view = ({ a = get.a.value() }) => <div>{a}</div>

    // ONLY VALID USE CASE
    const c: view = ({ a = get.a }) => <button onClick={() => console.log(a.value())} />
    ```
3. Use an **eager** `get` for sync usage.

4. Use a **lazy** `get` for async usage.
