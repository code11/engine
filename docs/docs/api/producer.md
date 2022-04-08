---
id: producer
title: producer
sidebar_label: producer
---

## Overview

A `producer` is simply a function that gets executed when something interesting
(a trigger) changes in state.

Any function can be turned into a producer by labeling it with `producer`. It
allows using Engine features to interact with the state using
[observe](/docs/api/observe), [get](/docs/api/get), and
[update](/docs/api/update). It is also possible to use [prop](/docs/api/prop) in
producers, even though it is not possible to pass a value directly to the
producer. producer receives same values as the [view](/docs/api/view) it is
added to in `prop`s.

The syntax is straight forward:

```ts
const producer: producer = (
  {
    /* header */
  }
) => {
  /* body */
};
```

The **header** is a regular object that uses the Engine API to declare what data
the producer needs at runtime.

```
{
  bar = observe.foo.bar,
  baz = get.foo.baz
}
```

The **body** part is left entirely to the developer. It's a normal function
body.

<img src='/static/img/producer.jpg' alt='Producer' />

Additionally, the producer function can return a callback for clean-up purposes.
This will be called when the producer will be unmounted from the state and thus
no longer in operation.

## Running a producer

A `producer` can not be called directly. Engine considers a `producer` for
execution if it is added to a [view](/docs/api/view)'s `.producers` array, or is
added to `Engine`'s global producers list. e.g `myProducer` can added to a
`Button` view with:

    ```tsx
    Button.producers([myProducer]);
    ```

`producer`s are executed by Engine on following occasions:

1. Globally added `producer`s are executed once when engine starts
2. `producer`s added to a [view](/docs/api/view)'s `producers` array are
   executed once every time the view is mounted
3. A `producer` is executed every time any of its `observe`d value (also
   referred to as producer's trigger) is updated.

## Example

`observe`, `get` and `update` are used in the first object argument of a
producer function, which is referred to as the "header" of a function. In the
header, Engine operators can be used to interact with state. For example

```tsx
const todoCounter: producer = ({
  todosById = observe.todosById,
  updateCount = update.count
}) => (
  const count = Object.keys(todosById).length;

  updateCount.set(count);
);
```

## Example with clean-up

```tsx
const subscriber: producer = ({
  something = update.something
}) => (
  const stream = subscribeToStream(value => {
    something.set(value)
  })
  return () => {
    stream.unsubscribe()
  }
);
```

## Parts

Although a producer is just a function, at a conceptual level it can be broken
into parts with different/specific responsibilities:

<img src='/static/img/producer-parts.png' alt='Conceptual parts of a producer' />

### Header

This is where you declare everything that the producer will need in the
execution part.

It can take static data, variables, [parent
properties](/docs/api/prop), [path operations](/docs/api/path), [argument
references](/docs/api/arg).

Full example:

```ts
const foo = 123
const producer: producer = ({
  varValue = foo,
  staticValue = 'sample text',
  propValue = prop.value,
  propValue2, // Same as prop.propValue2
  updateValue = update.sample.path,
  observeValue = observe.sample.value,
  getValue = get.sample.otherValue,
  refValue = arg.propValue2
}) => { ... }
```

### Guards

Producers will be triggered by the Engine regardless of whether the data they
depend on is valid or not. It is the producer's responsability to decide if the
data is suitable for its execution needs.

Data from the triggers (i.e `observe` operations) should be checked first, and
the producer should exit if its requirements aren't fulfilled.

```ts
const producer: producer = ({
  description = observe.description,
  summary = update.summary,
}) => {
  if (!description || !isString(description)) {
    return;
  }
  summary.set(description.substr(0, 20));
};
```

Guards can also be used to stop effects from happening (e.g. triggering another system):

```ts
import axios from 'axios'
const producer: producer = ({
  post = axios.post
  trigger = observe.submit,
  getUrl = get.url
  getData = get.data,
  updateData = update.data,
  updateError = update.error
}) => {
  if (!trigger) {
    return
  }

  const data = getData();
  const url = getUrl();

  if (!isValid(data) || !url) {
  updateError.set('Invalid state');
    return;
  }

  try {
    const response = await post(url, data);

    updateData.set(response.data);
  } catch (err) {
    updateError.set(err.message);
  }
}
```

### Processing

Producers contain the logic of an Engine app. Any process (aka domain operation)
can (and should) be defined as one ore more producers acting on some data.
Processing data can be broadly categorized into two categories based on the kind
of results they achieve.

#### Effects

Producers can call other systems, interact with the environment and produces
changes that are not visible in the state.

For example making an XHR request to retrieve data, read the browser session
storage, interact with the DOM API or set timers.

#### Updates

Producers can update the current state of the Engine app. The state can only be
changed through the `update` operation.

This means, `producer`s will be pushing new data to the Engine which in turn
trigger other producers to execute and in turn update the state.

#### Clean-up

Producers can be long running by subscribing to streams, initiating long calls, using
timers, etc. As such, when the `producer` is unmounted from the state, it is the
`producer`'s responsability to provide a callback for clean-up purposes. See the
example above.

Note that a producer can be called multiple times so take care to not make duplicate
subscribing, etc. To do so, you can store a flag on the state which you can check
before creating the subscribe.

Also, all return values of a producer that are functions will be queued for the clean-up phase.
In order to avoid duplicate calls to the clean-up function ensure that the subscribe
and the clean-up return are only made in the subscribe scenario.

A producer can have multiple subscribes and clean-up functions (altough a best practice
is to have multiple producers that handle their individual scenario):

```
// Possible, but not recommended
const foo: producer = ({
  a = observe.a,
  b = observe.b
  getListener = get.listeners[param.type],
  updateListener = update.listeners[param.type]
}) => {
  if (a && !getListener.value({type: "a"})) {
    const off = events.on("a.stuff", (event) => { ... )}
    updateListener.set(true, {type: "a"})
    return () => {
      off()
    }
  }
  if (b && !getListener.value({type: "b"})) {
    const off = events.on("b.stuff", (event) => { ... )}
    updateListener.set(true, {type: "a"})
    return () => {
      off()
    }
  }
}
```

## Best practices

1. A `producer` should perform a single, very specific job. The more specific
   the better. It is okay to have many small producers doing one thing each.
2. All the dependencies of a producers should be passed in the header.
   The following is encouraged to increase the testability and reusability of the producer:

   ```ts
   import axios from 'axios'

   const producer: producer = ({
     get = axios.get,
     data = observe.data
     ...
   }) => {
     get({ ... })
   }
   ```
