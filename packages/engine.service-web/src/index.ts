#!/usr/bin/env node
import { engine, producers } from "@c11/engine.runtime";
import * as start from "./start";
import * as setup from "./setup";
import * as build from "./build";
import * as test from "./test";
import "./global";

const app = engine({
  use: [
    producers(Object.values(setup)),
    producers(Object.values(start)),
    producers(Object.values(build)),
    producers(Object.values(test)),
  ],
});

app.start();
