---
id: search
title: Search
sidebar_label: Search
---

### Search

Implements the following patterns: `Collections`, `Triggers`,  

```
{
  search: {
    items: Path.articles.items,
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
