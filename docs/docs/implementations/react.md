---
id: react
title: React
sidebar_label: React
---

**Package name:** [@c11/engine.react](/docs/packages)

[Engine](/docs/api/engine) implementation for React.

## Installation

```bash
npm install @c11/engine.react 
```

## Setup

```tsx
import { render, component } from '@c11/engine.react'
import { engine } from '@c11/engine.runtime'

const Greeting: view = ({
  greeting = observe.greeting
}) => <div>{greeting}</div>

const hello: producer = ({
  name = observe.name,
  greeting = update.greeting
}) => greeting.set(`Hello ${name}!`)

const App = component(Greeting, [hello])

const app = engine({
  state: {
    name: "John Doe"
  },
  use: [render(<App />, '#root')]
});

app.start();

```
