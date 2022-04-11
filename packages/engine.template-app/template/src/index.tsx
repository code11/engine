import { engine } from "@c11/engine.runtime";
import { render } from "@c11/engine.react";
import { App } from "./App";
import "./global";

const app = engine({
  use: [
    render(<App />, "#app", {
      debug: process.env.NODE_ENV === "development",
    }),
  ],
});

app.start();
