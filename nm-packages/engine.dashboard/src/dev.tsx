import { engine, producers, pathFn } from "@c11/engine.runtime";
import { EventNames } from "@c11/engine.types";
import { debug } from "@c11/engine.patterns";
import { render } from "@c11/engine.react";
import { connectToDashboard } from "../common/connectToDashboard";
import { App } from "./App";
import * as producerList from "./producers";
import "./global";

const dashboard = connectToDashboard();
const receiveUpdates: producer = ({ updatePath = update }) => {
  dashboard.on((event) => {
    event.data.text().then((x) => {
      const op = JSON.parse(x);
      const result = updatePath(pathFn(...op.path));
      result.set(op.value);
    });
  });
};

const app = engine({
  onEvents: {
    [EventNames.STATE_UPDATED]: dashboard.send,
    [EventNames.PATCH_APPLIED]: dashboard.send,
  },
  state: {},
  use: [
    render(<App />, "#app", {
      debug: false,
    }),
    producers([producerList, debug, receiveUpdates]),
  ],
});

app.start();

// Each renderer can have a state where it stores if it finished rendering/mounting/etc
// This can be used to hook-up processes for export for example
