---
id: producer
title: Producer
sidebar_label: Producer
---

```ts
import { Producer } from "@c11/engine.macro"
```

## Overview

A `Producer` is simply a function that gets executed when something interesting
(a trigger) changes in state.

Any function can be turned into a producer by labeling it with `producer`. It
allows using Engine features to interact with the state using
[Observe](/docs/api/observe), [Get](/docs/api/get), and
[Update](/docs/api/update). It is also possible to use [Prop](/docs/api/prop) in
producers, even though it is not possible to pass a value directly to the
producer. producer receives same values as the [view](/docs/api/view) it is
added to in `Prop`s.


The syntax is straight forward:
```ts
const producer: Producer = ({ /* header */ }) => { /* body */ }
```

The **header** is a regular object that uses the Engine API to declare what data
the producer needs at runtime.

```
{
  bar = Observe.foo.bar,
  baz = Get.foo.baz
}
```

The **body** part is left entirely to the developer. It's a normal function
body.

<img src='/static/img/producer.jpg' alt='Producer' />

## Running a producer

A `producer` can not be called directly. Engine considers a `producer` for
execution if it is added to a [view](/docs/api/view)'s `.producers` array, or is
added to `Engine`'s global producers list. e.g `myProducer` can added to a
`Button` view with:

    ```tsx
    Button.producers = [myProducer];
    ```

`producer`s are executed by Engine on following occasions:

  1. Globally added `producer`s are executed once when engine starts
  2. `producer`s added to a [view](/docs/api/view)'s `producers` array are
     executed once every time the view is mounted
  3. A `producer` is executed every time any of its `Observe`d value (also
     referred to as producer's trigger) is updated.

## Example

`Observe`, `Get` and `Update` are used in the first object argument of a
producer function, which is referred to as the "header" of a function. In the
header, Engine operators can be used to interact with state. For example

```tsx
const todoCounter: producer = ({
  todosById: Observe.todosById,
  updateCount = Update.count
}) => (
  const count = Object.keys(todosById).length;

  updateCount.set(count);
);
```


## Parts

Although a producer is just a function, at a conceptual level it can be broken
into parts with different/specific responsibilities:

<img src='/static/img/producer-parts.png' alt='Conceptual parts of a Producer' />

### Header

This is where you declare everything that the producer will need in the
execution part.

It can take static data, variables, [parent
properties](/docs/api/prop), [path operations](/docs/api/path), [argument
references](/docs/api/arg).

Full example:

```ts
const foo = 123
const producer: Producer = ({
  varValue = foo,
  staticValue = 'sample text',
  propValue = Prop.value,
  propValue2, // Same as Prop.propValue2
  updateValue = Update.sample.path,
  observeValue = Observe.sample.value,
  getValue = Get.sample.otherValue,
  refValue = Arg.propValue2
}) => { ... }
```

### Guards

Producers will be triggered by the Engine regardless of whether the data they
depend on is valid or not. It is the producer's responsability to decide if the
data is suitable for its execution needs.

Data from the triggers (i.e `Observe` operations) should be checked first, and
the producer should exit if its requirements aren't fulfilled.

```ts
const producer: Producer = ({
  description = Observe.description,
  summary = Update.summary
}) => {
  if (!description || !isString(description) ) {
    return
  }
  summary.set(description.substr(0, 20))
}
```

Guards can also be used to stop effects from happening (e.g. triggering another system):
```ts
import axios from 'axios'
const producer: Producer = ({
  post = axios.post
  trigger = Observe.submit,
  getUrl = Get.url
  getData = Get.data,
  updateData = Update.data
}) => {
  if (!trigger) {
    return
  }

  const data = getData();
  const url = getUrl();

  if (!isValid(data) || !url) {
    return;
  }

  updateData.set(data);
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
changed through the `Update` operation.

This means, `Producers` will be pushing new data to the Engine which in turn
trigger other producers to execute and in turn update the state.


## Best practices

1. A `producer` should perform a single, very specific job. The more specific
   the better. It is okay to have many small producers doing one thing each.
2. All the dependencies of a Producers should be passed in the header.
   The following is encouraged to increase the testability and reusability of the producer:
   ```ts
   import axios from 'axios'

   const producer: Producer = ({
     get = axios.get,
     data = Observe.data
     ...
   }) => {
     get({ ... })
   }
   ```
