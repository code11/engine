---
id: react
title: React
sidebar_label: React
---

**Package name:** `@c11/engine.react`

## Installation

```bash
npm install @c11/engine.react @c11/engine.macro
```

## Setup

```tsx
import React from 'react'
import { View, Producer, Observe, Update } from '@c11/engine.macro'
import { Engine } from '@c11/engine.react'

const App: View = ({
  greeting = Observe.greeting
}) => <div>{greeting}</div>

const greeting: Producer = ({
  name = Observe.name,
  greeting = Update.greeting 
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

