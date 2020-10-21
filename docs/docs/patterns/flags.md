---
id: flags
title: Flags
sidebar_label: Flags
---

Flags store conclusions regarding the state of some data. Usually a producer will observe some data and then update a single location with flag information. In this way decisions avoid being computed where they are needed and instead rely on the state to provide this information.

Keeping flags on the state decreases complexity and helps code to be more modular.


`user.isAuth` - is populated by a producer that uses different sources (local storage, session, etc) to determine wheter the user has a valid session or not and stores this information on the state
```
{
  user: {
    isAuth: true
  }
}
```

`balloons.items.*.isInflated` - is populated by a producer that observes `ballons.items.*.capacity` and `balloons.items.*.air` and if the air will equal the capacity it will update the path with true otherwise false
`balloons.areInflated` - is populated by a producer that observes `balloons.items.*.isInflated` and `balloons.count` and will update the `areInflated` path once the `isInflated` count is equal to the `balloons.count`
```
{
  balloons: {
    items: {
      "abc": {
        isInflated: false,
        air: 40,
        capacity: 100,
      },
      "xyz": {
        isInflated: true,
        air: 80,
        capacity: 80,
      }
    },
    count: 2,
    areInflated: false,
  }

}
```
