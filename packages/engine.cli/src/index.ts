#!/usr/bin/env node
import { engine, producers } from "@c11/engine.runtime";
import * as create from "./create";
import * as setup from "./setup";
import "./global";

const app = engine({
  use: [producers(Object.values(create)), producers(Object.values(setup))],
});

app.start();
