---
id: react
title: React
sidebar_label: React
---

**Package name:** [@c11/engine.react](/docs/packages)

[Engine](/docs/api/engine) implementation for React.

## Installation

```bash
npm install @c11/engine.react @c11/engine.macro
```

## Setup

```tsx
import React from 'react'
import { view, producer, observe, update } from '@c11/engine.macro'
import { Engine } from '@c11/engine.react'

const App: view = ({
  greeting = observe.greeting
}) => <div>{greeting}</div>

const greeting: producer = ({
  name = observe.name,
  greeting = update.greeting
}) => greeting.set(`Hello ${name}!`)

App.producers = [greeting]

const engine = new Engine({
  state: {
    name: "John Doe"
  },
  view: {
    component: <App />,
    root: "#root"
  }
});
```
