---
id: introduction
title: Introduction
sidebar_label: Introduction
---

### What is Code<sup>11</sup> Engine?

At its core, Engine is a state management system (like Redux and MobX) which
keenly focuses on developer productivity instead of some puritan ideals which
make your job harder.

But core is more than that. It goes as far as it needs to, to achieve its goals:

### Goals

- **Be Productive:** Optimized for developer productivity. We prefer blood magic over boilerplate
- **Be Fast:** Engine is very careful about what it'll cause to re-render, and
  don't waste CPU cycles unnecessarily

### Principles

1. **Single global State**<br />
  Maintaining a global state is very helpful, but also extremely wasteful. In
  most systems, it lead to one or more compromises.

    1. Components end up re-rendering unnecessarily even when nothing they depend
       on have actually changed.
    2. Developers have to do a lot of thinking about how to efficiently pick
       what they need from state, e.g in selectors. Selectors often become
       performance bottlenecks simply because of the shear rate of execution.

2. **No Boilerplate**<br />

  Engine takes developer productivity extremely seriously. We try to achieve it
  by:
    1. Eliminating all boilerplate<br />
    2. Being easy to use and understand
    3. Being intuitive
