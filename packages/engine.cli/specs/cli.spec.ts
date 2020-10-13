"use strict";

// const { spawnSync } = require("child_process");

// test("should build the app", () => { // test create script not bin
//   const loc = process.cwd() + "/my-app";
//   const spawn1 = spawnSync("engine create", ["my-app"]);
//   expect(spawn1.stderr).toBe(null); // test that the created directory contains a package.json
//   const spawn2 = spawnSync("yarn", ["build"]); //test build.js
//   expect(spawn2.stderr).toBe(null);
// fs.rmdirSync(loc, { recursive: true });
// });
test("should create a test app", async () => {
  console.log = jest.fn();
  const fs = require("fs");
  const appDir = "test-app";
  const appTemplate = "app";
  const loc = process.cwd() + `/${appDir}`;
  const runCreateAppScript = await require("../src/create-app")(
    appDir,
    appTemplate
  );
  fs.rmdirSync(loc, { recursive: true });
  expect(runCreateAppScript).toBe("done");
});
