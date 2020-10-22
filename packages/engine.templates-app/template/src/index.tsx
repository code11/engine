import React from "react";
import { Engine } from "@c11/engine.react";
import { App } from "./App";

const engine = new Engine({
  state: {
    initial: {
      name: "John Doe",
    },
  },
  view: {
    root: "#app",
    element: <App />
  },
});

engine.start();
