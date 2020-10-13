const { logStep } = require("../utils/logger");
const { unlinkSync } = require("fs");
const { resolve } = require("path");

export = ({ target }:{target:any}) => {
  logStep("Cleaning up unnecessary files...");
  const filesToRemove = [resolve(target, "package.template.json")];

  filesToRemove.forEach((file) => {
    unlinkSync(file);
  });
  logStep(`Cleanup done succesfully`);
};