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
      type: "doc",
      id: "testing",
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
      label: "Modules",
      items: ["modules/engine", "modules/react"],
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
