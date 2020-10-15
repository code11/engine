module.exports = {
  docs: [
    {
      type: "doc",
      id: "introduction",
    },
    {
      type: "category",
      label: "Getting Started",
      items: ["usage"],
    },
    {
      type: "doc",
      id: "cli",
    },
    {
      type: "category",
      label: "Concepts",
      items: ["concepts/state", "concepts/path-composition"],
    },
    {
      type: "category",
      label: "Guides",
      items: ["packages", "best-practices", "guides/debugging"],
    },
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
      type: "category",
      label: "Implementations",
      items: ["implementations/react"],
    },
    {
      type: "category",
      label: "Tutorials",
      items: [
        {
          type: "category",
          label: "React",
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
