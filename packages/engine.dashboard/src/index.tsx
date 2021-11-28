import { engine, producers } from "@c11/engine.runtime";
import { debug } from "@c11/engine.patterns";
import { render } from "@c11/engine.react";
import { App } from "./App";
import * as producerList from "./producers";
import "./global";

const app = engine({
  onEvents: (event) => {
    console.log(event);
  },
  state: {},
  use: [
    render(<App />, "#app", {
      debug: false,
    }),
    producers([producerList, debug]),
  ],
});

app.start();

// Each renderer can have a state where it stores if it finished rendering/mounting/etc
// This can be used to hook-up processes for export for example
