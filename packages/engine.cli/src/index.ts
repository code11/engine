#!/usr/bin/env node
import { engine, producers } from "@c11/engine";
import * as create from "./create";
import * as setup from "./setup";

engine({
  use: [
    producers(Object.values(create), { debug: true }),
    producers(Object.values(setup)),
  ],
}).start();
