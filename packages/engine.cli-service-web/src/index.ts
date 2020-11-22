#!/usr/bin/env node
import { engine, producers } from "@c11/engine";
import * as start from "./start";
import * as setup from "./setup";
import "./global";

engine({
  use: [
    producers(Object.values(setup), { debug: true }),
    producers(Object.values(start), { debug: true }),
  ],
}).start();
