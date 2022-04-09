---
id: aggregate
title: Aggregate
sidebar_label: Aggregate
---

The Aggregate pattern allows you to reduce a set of events.

```
{
  events: {
    raw: {},
    items: {
      "abc": {
        id: "abc",
        type: "entity.created",
        payload: {
          some: "data from abc"
        }
      },
      "xyz": {
        id: "xyz",
        type: "entity.updated",
        payload: {
          other: "data from xyz"
        }
      }
    },
    order: ["abc", "xyz"],
    state: {
      event: "xyz",
      value: {
        some: "data from abc",
        other: "data from xyz"
      }
    },
    triggers: {
      next: "xyz",
      done: timestamp
    }
  }
}
```
