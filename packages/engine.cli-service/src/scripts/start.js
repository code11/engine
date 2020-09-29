const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");

const config = require("../config/webpack.app.dev");
const { host, port } = require("../utils/server");

module.exports = () => new WebpackDevServer(webpack(config)).listen(port, host);
