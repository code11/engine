"use strict";

describe("creating an engine app", () => {
  const fs = require("fs");
  const appDir = "test-app";
  const loc = process.cwd() + `/${appDir}`;
  test("should create app script", async () => {
    console.log = jest.fn();
    const appTemplate = "app";
    const runCreateAppScript = await require("../src/create-app")(
      appDir,
      appTemplate
    );
    expect(runCreateAppScript).toBe("done");
  });
  test("should generate correct output", () => {
    let isGenerated = false;
    if (fs.existsSync(`${loc}/package.json`)) {
      isGenerated = true;
    }
    expect(isGenerated).toBe(true);
  });
  afterAll(() => {
    // fs.rmdirSync(loc, { recursive: true });
  });
});
