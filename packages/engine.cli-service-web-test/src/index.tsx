import { engine } from "@c11/engine";
import { renderReact } from "@c11/engine.react";
import { App } from "./App";
import "./global";

const initial: State = {
  name: "John Doe",
};

engine({
  state: initial,
  use: [renderReact(<App />, "#app")],
}).start();

// Each renderer can have a state where it stores if it finished rendering/mounting/etc
// This can be used to hook-up processes for export for example
