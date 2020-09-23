module.exports = {
  docs: {
    "Getting Started": [
      "introduction",
      "usage",
      {
        type: "category",
        label: "Quick Start With React",
        items: [
          "quick-start-tutorial/setup",
          "quick-start-tutorial/static-ui",
          {
            type: "category",
            label: "State",
            items: [
              "quick-start-tutorial/state-is-king",
              "quick-start-tutorial/accessing-state-in-components",
              "quick-start-tutorial/updating-state-from-components",
            ],
          },
          "quick-start-tutorial/introducing-producers",
          "quick-start-tutorial/state-as-communication-channel",
          "quick-start-tutorial/wrapping-up",
        ],
      },
    ],
    Concepts: ["concepts/state", "concepts/path-composition"],
    Guide: ["packages", "best-practices"],
    "API Documentation": [
      "api/engine",
      {
        type: "category",
        label: "Labels",
        items: ["api/producer", "api/view"],
      },
      {
        type: "category",
        label: "Operators",
        items: [
          {
            type: "category",
            label: "State Manipulation",
            items: ["api/observe", "api/get", "api/update"],
          },
          {
            type: "category",
            label: "Path Composition",
            items: [
              "api/path-composers/prop",
              "api/path-composers/arg",
              "api/path-composers/param",
              "api/path-composers/wildcard",
              "api/path-composers/path",
            ],
          },
        ],
      },
    ],
  },
};
