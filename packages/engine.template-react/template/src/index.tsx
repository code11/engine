import { engine } from "@c11/engine.runtime";
import { render } from "@c11/engine.react";
import { App } from "./App";
import "./global";

const app = engine({
  state: {
    name: "John Doe",
    item: {
      a: "this is a",
      b: "this is b",
    },
  },
  use: [
    render(<App />, "#app", {
      debug: process.env.NODE_ENV === "development",
    }),
  ],
});

app.start();

// Each renderer can have a state where it stores if it finished rendering/mounting/etc
// This can be used to hook-up processes for export for example
