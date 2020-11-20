import React from "react";
import { engine } from "@c11/engine";
import { render } from "@c11/engine.render-react";
import { App } from "./App";

engine({
  state: {
    name: "John Doe",
  },
  output: render(<App />, '#app')
});


// Each renderer can have a state where it stores if it finished rendering/mounting/etc
// This can be used to hook-up processes for export for example
