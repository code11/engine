# @c11 Engine

> A methodology and a library for building systems.

The @c11 Engine proposes a development methodology centered around data flow and asynchronous operations. It features an easy to understand and terse API focused on developer productivity.

The @c11 Engine recognizes that application development and computer science require fundamentally different approaches.
The first is concerned with data usage and interpretation while the latter is focused on data processing and computation.
Moreso, the criteria for measuring success is different in both instances.
The first deals with an evolving data model with specific user centric tasks.
The latter deals with rigid and usually general or abstract data models where performance is often a key consideration.  

There are several drawbacks of applying theory of computation and practices of system design to application development, these include:

## Overview

The @c11 Engine is:

- Methodology
- Library
- Compiler
- Development Tools
- Framework

## Architecture

The @c11 Engine makes the following assumptions:
- Any system, regardless of complexity, is defined by the relationship between those who produce data and those who view data
- Any system, at a given moment in time, has a unitary state which represents the totality of data at that moment in time

Based on these, the architecture is defined using three concepts: Producers, Views and Global State.

- __Producers__ react to changes in the __Global State__ and produce changes back to the __Global State__

### Producers

### Views


producer

view

Ref
Get
Prop
Arg
Merge
Set
Remove
