module.exports = {
  docs: {
    "Getting Started": [
      "introduction",
      "usage",
      {
        type: "category",
        label: "Quick Start Tutorial",
        items: [
          "quick-start-tutorial/setup",
          "quick-start-tutorial/static-ui",
          {
            type: "category",
            label: "State",
            items: [
              "quick-start-tutorial/state",
              "quick-start-tutorial/accessing-state-in-components",
              "quick-start-tutorial/updating-state-from-components",
            ],
          },
        ],
      },
    ],
    Guide: ["packages", "best-practices", "anti-patterns"],
    "API Documentation": [
      "api/engine",
      {
        type: "category",
        label: "Macros",
        items: [
          "api/producer",
          "api/view",
          "api/observe",
          "api/update",
          {
            type: "category",
            label: "Inputs",
            items: ["api/input-macros/prop"],
          },
        ],
      },
    ],
  },
};
