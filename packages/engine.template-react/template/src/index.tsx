import { engine } from "@c11/engine";
import { renderReact } from "@c11/engine.react";
import { App } from "./App";
import "./global";

engine({
  state: {
    name: "John Doe",
  },
  use: [renderReact(<App />, "#app")],
});

// Each renderer can have a state where it stores if it finished rendering/mounting/etc
// This can be used to hook-up processes for export for example
