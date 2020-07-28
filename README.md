@c11/engine is library for building web applications

## Run

The easiest way to get going with a sample app using using `create-react-app`:

```
npx create-react-app --template engine my-app
cd my-app
npm start
```

## Sample

### Browser

```jsx
import { Engine } from "@c11/engine.react";
import { view, Update, Observe } from "@c11/engine.macro";

const App: view = (value = Observe.foo.value, inc = Update.foo.value) => (
  <button onClick={() => inc.set(value + 1)}>Counter: {value}</div>
);

const engine = new Engine({
  state: {
    initial: {
      foo: {
        value: 0,
      },
    },
  },
  view: {
    root: "#root",
    element: <App />,
  },
});
```

### Node

```jsx
import { Engine } from "@c11/engine.node";
import { producer, Update, Observe } from "@c11/engine.macro";

const inc: producer = (value = Observe.foo.value, inc = Update.bar) => {
  console.log("Incrementing foo", value);
  inc.set(value + 1);
};

const logger: producer = (value = Observe.bar) => {
  console.log("Bar is ", value);
};

const engine = new Engine({
  state: {
    initial: {
      foo: {
        value: 0,
      },
    },
  },
  producers: {
    list: [inc, logger],
  },
});

// Incrementing foo, 0
// Bar is 1
```

## Views

Use the `view` type to tell the compiler to create a view component:

```js
const Foo: view = () => <div>Foo</div>;
```

---

Views recieve data from their parents as you would normally would:

```js
const Foo: view = (name) => <div>{name}</div>;
```

---

Views can sync with the global state by simply observing certain paths:

```js
const Foo: view = (name: Observe.foo.bar.name) => <div>{name}</div>;
```

When the foo.bar.name path changes the component is automatically re-rendered.

---

Views can receive props from the parent while still listening to state:

```js
const Foo: view = (qux, name: Observe.foo.bar.name) => (
  <div>
    {qux} - {name}
  </div>
);
const Baz: view = () => (
  <div>
    <Foo qux="123" />
  </div>
);
```

---

This is a great fit for passing partial data and then letting the child deal with its required data:

```js
const Person: view = (
  id,
  name = Observe.people[id].name,
  surname = Observe.items[id].surname
) => (
  <div>
    {name} {surname}
  </div>
);
const People: view = () => (
  <div>
    <Person id="123" />
    <Person id="321" />
  </div>
);
```

Any React functional component can be transformed to a `@c11/engine.react` component.

Views recieve props from their parent component. Also, views can listen to state changes and retrieve data without the intervention of the parent component. This reduces the dependency on the parent to supply the entire dataset for the child component.

Given the state is:

```json
{
  "entities": {
    "byId": {
      "a": {
        "name": "I'm A"
      },
      "b": {
        "name": "I'm B"
      }
    },
    "order": ["a", "b"]
  }
}
```

We can consider the following composition:

```jsx
const Item: view = (id, name = Observe.entities.byId[id].name) => (
  <li>{name}</li>
);

const List: view = (ids = Observe.entities.order) => (
  <ol>
    {ids.map((x) => (
      <Item id={x} />
    ))}
  </ol>
);
```

Which will output:

```html
<ol>
  <li>I'm A</li>
  <li>I'm B</li>
</ol>
```

## Producers

### Observe

Listener on state updates on a certain paths.

### Update

Use the `Update` keyword when you need to update values on the state.

The update operations can `set`, `remove`, `merge`

Examples:

```js
const example: producer = (foo = Update.foo) => {
  foo.set("123");
};
```

To remove don't overwrite the parent but just call the remove on the path.

### Get

Use the `Get` keyword when you don't want to listen to changes on a value but you still need the value in a producer

## Data path composition

### Param

Description

Example

```

```

Best practices:

```

```

### Prop

### Arg

Mnemotic / poetry for the API

## Notes on macro

What you see is not what you get! Magic happens.
