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
          "quick-start-tutorial/state",
          "quick-start-tutorial/mature-architecture",
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
