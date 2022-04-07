#!/usr/bin/env node
import { engine, producers } from "@c11/engine.runtime";
import * as startProducers from "./start";
import { config, onError } from "./setup";
import * as buildProducers from "./build";
import * as testProducers from "./test";
import "./global";

let starterFn;

const triggerStart: producer = ({
  _now,
  version = observe.config.version,
  start = update.start.triggers.init,
}) => {
  if (!version) {
    return;
  }
  start.set({
    opts: {},
    timestamp: _now(),
  });
};

const triggerConfig: producer = ({ _now, start = update.triggers.config }) => {
  starterFn = (path) => {
    start.set({
      path,
      timestamp: _now(),
    });
  };
};

const app = engine({
  use: [
    producers([
      triggerConfig,
      triggerStart,
      config,
      onError,
      startProducers,
      buildProducers,
      testProducers,
    ]),
  ],
});

app.start();
export const start = (path) => {
  if (!starterFn) {
    setTimeout(() => {
      starterFn(path);
    }, 100);
  } else {
    starterFn(path);
  }
  console.log("starting the application", path);
};

export const build = () => {};

export const test = () => {};

export { EngineConfig } from "./setup/config";
