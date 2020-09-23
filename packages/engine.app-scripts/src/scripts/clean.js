const { existsSync, rmdirSync } = require("fs");
const Paths = require("../utils/paths");

module.exports = () => {
  if (!existsSync(Paths.distApp)) {
    console.log(`Nothing to remove...`);
    return;
  }

  console.log(`Cleaning up...`);
  rmdirSync(Paths.distApp, { recursive: true });
  console.log(`Done`);
};
