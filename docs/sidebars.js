module.exports = {
  docs: [
    {
      type: "doc",
      id: "introduction",
    },
    {
      type: "doc",
      id: "getting-started",
    },
    {
      type: "category",
      label: "Tutorial",
      items: [
        "tutorials/react/setup",
        "tutorials/react/static-ui",
        {
          type: "category",
          label: "State",
          items: [
            "tutorials/react/state-is-king",
            "tutorials/react/accessing-state-in-components",
            "tutorials/react/updating-state-from-components",
          ],
        },
        "tutorials/react/introducing-producers",
        "tutorials/react/state-as-communication-channel",
        "tutorials/react/wrapping-up",
      ],
    },
    {
      type: "doc",
      id: "best-practices",
    },
    {
      type: "category",
      label: "Concepts",
      items: [
        "concepts/state",
        "concepts/path-composition",
        {
          type: "category",
          label: "Patterns",
          items: [
            "patterns/aggregate",
            "patterns/collections",
            "patterns/flags",
            "patterns/request-response",
            "patterns/search",
            "patterns/sections",
            "patterns/triggers",
          ],
        },
        {
          type: "doc",
          id: "testing",
        },
        {
          type: "doc",
          id: "modules/engine",
        },
      ],
    },
    {
      type: "category",
      label: "Packages",
      items: [
        {
          type: "doc",
          id: "packages/cli",
        },
        {
          type: "doc",
          id: "packages/service-web",
        },
        {
          type: "doc",
          id: "packages/dashboard",
        },
      ],
    },
    {
      type: "category",
      label: "API Reference",
      collapsed: false,
      items: [
        "api/engine",
        "api/producer",
        "api/view",
        "api/observe",
        "api/get",
        "api/update",
        "api/prop",
        "api/arg",
        "api/param",
        "api/wildcard",
        "api/path",
      ],
    },
  ],
};
