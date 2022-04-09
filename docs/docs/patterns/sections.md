---
id: sections
title: Sections
sidebar_label: Sections
---

Implements the following patterns: [Collections](/docs/patterns/collections)

Sections are parts of an application that are shown at certain times. These can
be full pages or smaller parts, like a menu bar.

The `isMounted` flag on sections can be a trigger for a producer to decide if a
certain section needs to be present or not.

For example when loading an application a producer can decide that the
`Initialitzation` section should be visible if data is not yet synced. After the
data is synced the same or another producer can decide that the `Login` page
should be shown. If the user is authenticated then the `Dashboard` page would be
shown. If the user is of a certain type then the `StatisticsPanel` can be shown.

Each section has a `data` location where it can store temporary data.

```
enum Sections {
  XYZ = 'xyz',
  ABC = 'abc'
}

```

```
{
  sections: {
    items: {
      [Sections.XYZ]: {
        id: Sections.XYZ,
        isMounted: true,
        data: {
          tempValue: '123'
        }
      },
      [Sections.ABC]: {
        id: Sections.ABC,
        isMounted: false,
        data: {}
      }
    },
    ids: ['xyz', 'abc']
  }
}
```

```
const SectionXyz: view = ({
  isMounted = observe.sections.items[Sections.XYZ].isMounted,
  data = observe.sections.items[Sections.XYZ].data.tempValue
}) => isMounted && <div>I'm section xyz: {data}</div>
```

```
const SectionAbc: view = ({
  isMounted = observe.sections.items[Sections.Abc].isMounted
}) => isMounted && <div>I'm section abc</div>
```

```
const App: view = () => <>
  <SectionXyz />
  <SectionAbc />
</>
```
