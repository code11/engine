---
id: collections
title: Collections
sidebar_label: Collections
---

### Collections

Collections group similar data structures together and provide a friendly way of accesing and working with those data structures.

Collections are very useful used in conjuction with entities.

Entities are domain object that are uniquely defined by a unique identifier, and not by their attributes.

[More description]

In the Engine data structure it's best to aim for balance between normalizing and denormalizing data based on the needs of observing changes or accesing partial or processed data.

As a rule of thumb, data received from the outside of the system should be kept in a raw form somewhere so that it can be transformed in the many ways needed from your system.

Also, very important is for the `item` to have its `id` stored on its data structure. Items should always be able to exist on their own if needed.

In the following example there are many data processing patterns used:
`articles.raw` - stores denormalized data
`articles.items` - is made by a producer that makes a reduce over `articles.raw` and extracts only the information needed by the application & only the items needed for the application
`articles.ids` - is made by a producer that makes a reduce over `articles.items` and extracts only the list of ids - useful when you want to iterate on all articles but you don't want to get the data associated with the ids
`articles.count` - is made by a producer that makes a reduce over `articles.ids` and gives the no. of articles
`articles.filters.category` - is made by a producer that groups articles by their category - useful when you want to iterate on a single category - the existance of this producer is determined by the need of this information
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

