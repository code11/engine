---
id: collections
title: Collections
sidebar_label: Collections
---

Collections group similar data structures together and provide a friendly way of
accessing and working with those data structures. Collections are very useful
when used in conjuction with entities.

Entities are domain objects that are uniquely defined by a unique identifier.

In Engine, it's best to aim for achieving a balance between normalizing and
denormalizing data based on the needs of observing changes or accessing partial
or processed data. As a rule of thumb, data received from the outside of the
system should be kept in a raw form somewhere so that it can be transformed in
the many ways needed from your system.

Also, it's very important for an Entity to have its `id` stored in its data
structure. Entities should always be able to exist on their own if needed.

In the following example several data processing patterns are used:

- `articles.raw` stores denormalized data received from an API.
- `articles.items` is created by a producer that `reduce`s `articles.raw` and
  extracts only the information needed by the application; and only the items
  needed for the application.
- `articles.ids` is created by a producer that `reduce`s `articles.items` and
  extracts only the list of ids. This is useful when you want to iterate on all
  articles but you don't want to get the data associated with the ids.
- `articles.count` is made by a producer that `reduce`s `articles.ids` and gives
  the number of articles.
- `articles.filters` is made by a producer that groups articles by their
  category. It's useful when you want to iterate on a single category. The
  existence of this producer is determined by the need of this information.

```
{
  articles: {
    raw: {
      abc: {
        [...]
      },
      dfg: {
        [...]
      },
      xyz: {
        [...]
      },
    },
    items: {
      abc: {
        id: "abc",
        title: 'Abc shorts',
        category: 'shorts'
      },
      xyz: {
        id: "xyz",
        title: 'Xyz news',
        category: 'news'
      },
    },
    ids: ['xyz'],
    count: 1,
    filters: {
      category: {
        shorts: ['abc'],
        news: ['xyz]
      }
    },
  }
}
```
