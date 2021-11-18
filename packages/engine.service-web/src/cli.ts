#!/usr/bin/env node
import { engine, producers } from "@c11/engine.runtime";
import * as start from "./start";
import * as setup from "./setup";
import * as build from "./build";
import * as test from "./test";
import "./global";

const app = engine({
  use: [producers([setup, start, build, test])],
});

app.start();
