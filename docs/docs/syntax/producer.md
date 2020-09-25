---
id: producer
title: Producer
sidebar_label: Producer
---

```ts
import { Producer } from "@c11/engine.macro"
```

## Overview

A `Producer` is a function that reacts to specific state changes and produces new data through specific state updates. It can also produce effects. 


The syntax is straight forward:
```ts
const producer: Producer = ({ /* declarations */ }) => { /* execution */ }
```

The **declarations** is a regular object that uses the Engine API to declare what data the producer needs at runtime.

```
{
  bar = Observe.foo.bar,
  baz = Get.foo.baz
}
```

The **execution** part is left entirely to the developer.

Diagram (not working for some reason):
![Producer](/img/producer.jpg)

## Running a producer

A `producer` can not be called directly. `producer`s are only ever executed by
Engine when they meet following 2 conditions:

 1. A `producer` must be added to a [view](/docs/api/view)'s `.producers` array,
    or in `Engine`'s global producers list. e.g `myProducer` can added to the
    `Button` view with:

    ```tsx
    Button.producers = [myProducer];
    ```
  2. A `producer` must have at least one trigger. Using
     [Observe](/docs/api/observe) is the only way to add a trigger to a
     `producer`. Whenever an `Observe`d value is changed (e.g using
     [Update](/docs/api/update)), the `producer` is re-executed.
     !!! Not necessarily, you can also create an empty producer that will be called when the Engine boots but it won't receive any argument.


## Other ideas:

Producers are managed entirely by the Engine which will instantiate, trigger and remove them.

Producers should handle a very specific task. The more specific, the better.

Producers cannot be composed or inherited or operated in any way.

Each producer lives in complete isolation from other producers. The only way producers can communicate is through state changes.

The developer will not be able to decide when a producer will be executed.

Any logic regarding the reason that a producer shouldn't be executed will exist in the `Guards` section (see bellow)

When producers need to share references (to streams, xhr requests, dom nodes, etc) they need to use the state for this sharing.

## Parts

The `Producer` is build up from from one or more parts with different/specific responsabilities:

- Header
- Guards
- Processing
- Effects
- Updates

### Header

This is where you declare everything that the producer will need in the execution part.

It can take static data, variables, parent properties, path operations, argument references.

Any function can become a producer by labeling it with `producer`. It allows using Engine features to interact with
the state using [Observe](/docs/api/observe), [Get](/docs/api/get), and
[Update](/docs/api/update).

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

Producers should be pure functions and any service used should be passed in the header.

The following is encuraged to increase the testability and reusability of the producer:
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

### Guards
Producers will be triggered by the Engine with both valid and invalid data.

It is the producer responsability to decide if the data is suitable to its execution needs.

Data from `Observe` operations should be checked first and the producer should exit (using return) fast.

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

Guards can also stop effects from happening (e.g. triggering another system):
```ts
import axios from 'axios'
const producer: Producer = ({
  post = axios.post
  trigger = Observe.submit,
  getUrl = Get.url
  getData = Get.data
}) => {
  if (!trigger) {
    return
  }

  const data = getData())
  const url = getUrl()
  if (!isValid(data) || !url) {
    return
  }

  post(url, data) // best practice is to handle then and catch
}
```

### Processing
`Producers` are responsibile with transforming or interpreting the data received from the state.

Producers contain the logic of the Engine and any process will be defined as one ore more producers that process data and act upon it.

### Effects
Producers can call other systems, interact with the environment and produces changes that are not visible in the state.

As mentioned above, the APIs for doing these effects should be received from the `Header` in order to keep the producer pure.

With outside effects, producers will be able to create new data that didn't exist before.

For example making an XHR request to retrieve data, read the browser session storage, interact with the DOM API or set timers.

Producers should inform the state upon the succesful completion or failure to carry out effects.

Managing the failure of the effects should be handled in a separate producer if those failures are not recoverable.

### Updates
The state can only be changed through the `Update` operation.

This means, `Producers` will be pushing new data to the Engine which in turn trigger other producers to execute and in turn update the state.

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

## Best practices

Engine recommends that `producer`s should perform a single job. It is okay to
have many small producers doing one thing each.

## Instance

For debugging pruposes only - Documentation in progress
