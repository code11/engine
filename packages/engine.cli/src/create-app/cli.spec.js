"use strict";

const fs = require("fs");
const { spawnSync } = require("child_process");

test("should build the app", () => {
  const loc = process.cwd() + "/testapp";
  const spawn1 = spawnSync("create-engine-app", ["testapp"]);
  expect(spawn1.stderr).toBe(null);
  const spawn2 = spawnSync("yarn", ["build"]);
  expect(spawn2.stderr).toBe(null);
  fs.rmdirSync(loc, { recursive: true });
});
