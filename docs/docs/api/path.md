---
id: path
title: Path
sidebar_label: Path
---

`Path` allow a parent view to give an arbitrary path to a child view at runtime.

It differs from rest of the path-composition operators in its usage. Path don't
go in the header of a producer or view, but is used like state-manipulation
operators.

For example, imagine a `LoginForm` view, whose producer performs the login, and
stores a message in state. Instead of accessing this message itself, `LoginForm`
can give Path to the message to `Alert`.

```tsx
const LoginForm: view = () => (
  <Alert messagePath={Path.login.status.message} />
);
```

`Alert` can then access the message:
```tsx
const Alert: view = ({
  message: Observe[Prop.messagePath]
}) => { ... }
```
