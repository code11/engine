#!/usr/bin/env node
import { engine, producers } from "@c11/engine.runtime";
import * as startProducers from "./start";
import { config, onError } from "./setup";
import * as buildProducers from "./build";
import * as testProducers from "./test";
import "./global";

let starterFn;

const starter: producer = ({ _now, start = update.start.triggers.init }) => {
  starterFn = () => {
    start.set({
      opts: {},
      timestamp: _now(),
    });
  };
};

const app = engine({
  use: [
    producers([
      starter,
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
      starterFn();
    }, 100);
  } else {
    starterFn();
  }
  console.log("starting the application", path);
};

export const build = () => {};

export const test = () => {};
