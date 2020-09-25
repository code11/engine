---
id: packages
title: Packages
sidebar_label: Packages
---

Engine code is divided up into multiple npm packages, which can be imported
independently on-need basis.

1. `@c11/engine.macro`

  `@c11/engine.macro` is the core of Engine. It contains all the magic that
  makes Engine so productive. Every engine app depends on this package.

  Engine uses [Babel Macros](https://github.com/kentcdodds/babel-plugin-macros)
  defined in this package to save us from a lot of boilerplate.

2. `@c11/engine.react`

  Contains react bindings for Engine. `@c11/engine.react` is required for
  creating React applications which use engine.

  When building Engine applications, most concepts of React translate quite
  transparently. For example, Engine [view](/docs/api/view)s are equivalent to
  React components, view props are equivalent to react props etc.
