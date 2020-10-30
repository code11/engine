---
id: path
title: path
sidebar_label: path
---

```ts
import { path } from "@c11/engine.macro"
```

## Overview

`path` allow a parent view to give an arbitrary path to a child view at runtime.

It differs from rest of the path-composition operators in its usage. path don't
go in the header of a producer or view, but is instead used for accessing values
in the state.

`path` offers most advantage when you want to create a reusable component, and
not want to hard-code paths. `path` offers the user of the component the freedom
to define where they want to store the component's data.

## Example

For example, imagine a `LoginForm` view, whose producer performs the login, and
stores a message in state. Instead of accessing this message itself, `LoginForm`
can give path to the message to `Alert`.

```tsx
const LoginForm: view = () => (
  <Alert messagePath={path.login.status.message} />
);
```

`Alert` can then access the message:
```tsx
const Alert: view = ({
  message = observe[prop.messagePath]
}) => { ... }
```
