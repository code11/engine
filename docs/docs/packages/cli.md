---
id: cli
title: "@c11/engine.cli"
sidebar_label: "@c11/engine.cli"
---

Engine provides a convenient CLI to work with engine apps. It can be installed globally or used with `npx`. 

```bash
npm install -g @c11/engine.cli
```

Running above command will make `engine` command available in your terminal.

## Commands

### `engine create <my-app>`

`engine create` allow creating new engine applications. For example, running:

```bash
engine create my-awesome-application
```

Creates a new directory named `my-awesome-application`, with a simple starter
engine application with react.

#### Options

- `-t, --template <template-name>`

  Default: `@c11/engine.template-react`.

  Available templates:
  - `@c11/engine.template-react` [source](https://github.com/code11/engine/tree/master/packages/engine.template-react)
