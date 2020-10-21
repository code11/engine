---
id: cli
title: CLI
sidebar_label: CLI
---

Engine provides a convenient CLI to work with engine apps. It can be installed with:

```bash
npm i -g @c11/engine.cli
```

Running above command will make `engine` command available in your terminal.

## Commands

### `engine create <my-app>`

`engine create` allow creating new engine applications. For example, running:

```bash
engine create my-awesome-application
```

creates a new directory named `my-awesome-application`, with a simple starter
engine application.

It is possible to configure which starter application template will be used by
`engine create`.

#### Options

- `-t, --template <template-name>`

  If the `<template-name>` starts with `@`, then then the npm package with
  `<template-name>` will be used. Otherwise, the template package used will be
  `@c11/template.<template-name>`. By default, the value of `<template-name>` is
  "app"; which means, `@c11/template.app` is used for the starter application.

### `engine start`

`engine start` is used from within an engine application. Most of the time it is
executed as an npm script, and not executed directly. For example, running:

```bash
npm start
```

inside an engine application will start a development server on port 3000.

### `engine build`

`engine build` is similar to `engine start`, but instead of starting a
development server, it creates a build in `dist` directory. This is akin to
creating a distribute-able bundle with webpack.

```bash
npm run build
ls # dist directory has been created
```

### `engine clean`

`engine clearn` is also used within an engine application. It cleans (i.e
removes) the distribute-able bundle created with `engine build`.

```bash
ls # dist directory is present
npm run clean
ls # dist directory has been removed
```
