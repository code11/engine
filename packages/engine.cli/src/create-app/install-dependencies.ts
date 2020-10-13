const { logStep } = require("../utils/logger");
const { spawnSync } = require("child_process");

export = ({ target }:{target:any}) => {
  logStep(`Installing dependencies, hang on...`);

  logStep(`Executing npm install, this may take a while`);
  spawnSync("npm", ["install"], {
    cwd: target,
    stdio: "ignore",
  });

  logStep(`Packages installed succesfully`);
};
