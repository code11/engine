const { existsSync, rmdirSync } = require("fs");
const Paths = require("../utils/paths");

export = () => {
  if (!existsSync(Paths.distApp)) {
    console.log(`Nothing to remove...`);
    return;
  }

  console.log(`Cleaning up...`);
  rmdirSync(Paths.distApp, { recursive: true });
  console.log(`Done`);
};
