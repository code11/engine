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

  Contains react bindings for Engine. Whenever we are creating a React
  application, we are going to need this one. Almost always, all you need to
  import from this package is `Engine` class.
