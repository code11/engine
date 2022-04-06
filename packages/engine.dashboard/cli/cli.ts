#!/usr/bin/env node
import { join } from "path";
import "./codeSync";
import { start } from "@c11/engine.service-web";

start(join(__dirname, ".."));
