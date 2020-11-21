#!/usr/bin/env node
import { engine, producers } from "@c11/engine";
import * as start from "./start";
import "./global";

engine({
  use: [producers(Object.values(start), { debug: true })],
}).start();
