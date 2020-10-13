const webpack = require("webpack");

export = async () => {
  // Decide which webpack to use based on arguments
  const config = require("../config/webpack.app.prod");
  const cmds: Promise<void>[] = [];
  const webpackResult = new Promise<void>((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details);
        }
        reject();
        return;
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        console.error(info.errors);
        reject();
      }

      if (stats.hasWarnings()) {
        console.warn(info.warnings);
      }

      console.log(stats.toString());
      console.log(`Build complete`);
      resolve();
    });
  });

  cmds.push(webpackResult);
  return Promise.all(cmds);
};
