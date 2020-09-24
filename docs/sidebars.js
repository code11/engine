module.exports = {
  docs: {
    "Getting Started": ["introduction", "usage"],
    Concepts: ["concepts/state", "concepts/path-composition"],
    Guides: ["packages", "best-practices", "guides/debugging"],
    "API Reference": [
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
    Implementations: [
     "implementations/react"
    ],
    Tutorials: [
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
};
