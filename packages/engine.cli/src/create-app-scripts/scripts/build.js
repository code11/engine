const webpack = require("webpack");

module.exports = async () => {
  // Decide which webpack to use based on arguments
  const config = require("../config/webpack.app.prod");
  const cmds = []
  const webpackResult = new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details);
        }
        reject()
        return;
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        console.error(info.errors);
        reject()
      }

      if (stats.hasWarnings()) {
        console.warn(info.warnings);
      }

      console.log(stats.toString())
      resolve()
    });
  }).then((result) => {
      console.log(`Build complete`);
    })
    .catch((err) => {
      console.error(`Build failed`, err);
    });

  cmds.push(webpackResult);
  return Promise.all(cmds)
}
