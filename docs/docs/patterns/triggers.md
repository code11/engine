---
id: triggers
title: Triggers
sidebar_label: Triggers
---

### Triggers

Triggers are explicit actions that are recorded in the state. Triggers resemble
an event but without the event boilerplate. A trigger is a recording than an
intent, made by someone or something and might be acted-on (or not) by a
producer.

The intent is captured in the form of a path. For example an update to
`Path.articles.triggers.delete` will record the fact that a certain article
needs to be deleted.

The main way in which a trigger is recored is by the use of a timestamp. The
path where the trigger is saved defines what the trigger means. Because of this,
the trigger only needs to supply to the state, the fact that at a certain time,
that intent was recorded. Some triggers will need a bigger set of data to ensure
a certain action can be performed.

Usually triggers are bounded by a certain collection or domain.

As a rule of thumb, a single producer should react on a certain trigger.
Otherwise race conditions are possible and will likely occur as you cannot
control which producer will execute first.

After a producer decides that a trigger is valid for its execution, the producer
should clear the data at that trigger, thus making it obvious that the trigger
was consumed.

```
{
  user: {
    isAuth: false,
    data: {
      id: undefined
      name: undefined,
    }
    credentials: {
      username: '',
      password: ''
    },
    triggers: {
      login: timestamp,
      logout: timestamp,
    }
  }
}
```

```
{
  shoppingCart: {
    items: { ... },
    triggers: {
      add: timestamp,
      remove: timestamp,
      empty: timestamp,
      checkout: timestamp
    }
  }
}
```
