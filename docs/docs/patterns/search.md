---
id: search
title: Search
sidebar_label: Search
---

### Search

Implements the following patterns: [Collections](/docs/patterns/collections),
[Triggers](/docs/patterns/triggers)

```
{
  search: {
    items: path.articles.items,
    term: 'something',
    filters: {
      category: ['news']
    },
    results: {
      ids: [],
      count: 2
    },
    triggers: {
      empty: undefined,
      toggleFilter: undefined,
      refresh: undefined
    }
  }
}
```
