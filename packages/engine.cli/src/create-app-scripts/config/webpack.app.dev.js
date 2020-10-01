const { readFileSync, existsSync } = require("fs");
const Webpack = require("webpack");

// const EncodingPlugin = require("webpack-encoding-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const babelConfig = require("./babel.config");
const paths = require("../utils/paths");

const FILE_LOADER_NAME_PATTERN = "[name].[ext]?[hash]";
const FILE_LOADER_OUTPUT_PATH = "assets";

const PACKAGED_HTML_FILE_NAME = "index.html";

module.exports = {
  mode: "development",
  devtool: "eval-source-map",

  entry: {
    app: paths.appLoader
  },
  output: {
    path: paths.distApp,
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    /*
      This might look a bit strange, but it has a very good explanation
        - We need the app node modules directory in order to recognize template app dependencies
        - We need the local node modules reference in order to find all the corejs, babel and webpack dependencies (managed by 'scripts')
    */
    modules: [
      // paths.folders.src,
      paths.src,
      paths.nodeModules,
      "node_modules",
    ],
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        // exclude: fileIsES5(FILE_ENCODING),
        use: [
          {
            loader: "babel-loader",
            options: Object.assign(
              {
                cacheDirectory: true,
              },
              babelConfig
            ),
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { modules: true, importLoaders: 1 },
          },
          {
            loader: "postcss-loader",
            options: {
              modules: true,
              plugins: [require("autoprefixer")({ grid: false })],
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: FILE_LOADER_NAME_PATTERN,
              outputPath: FILE_LOADER_OUTPUT_PATH,
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/",
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "svg-inline-loader",
          },
        ],
      },
    ],
  },

  plugins: [
    new Webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: paths.htmlTemplate,
      filename: PACKAGED_HTML_FILE_NAME,
      favicon: paths.htmlFavicon,
    }),
  ],

  devServer: {
    watchOptions: {
      poll: 200,
    },

    inline: true,
    hot: true,
    historyApiFallback: true,
    disableHostCheck: true,

    before: function (app, webpackServer) {
      // We override the listen() function to set keepAliveTimeout.
      // See: https://github.com/microsoft/WSL/issues/4340
      // Original listen(): https://github.com/webpack/webpack-dev-server/blob/f80e2ae101e25985f0d7e3e9af36c307bfc163d2/lib/Server.js#L744
      const { listen } = webpackServer;
      webpackServer.listen = function (...args) {
        const server = listen.call(this, ...args);
        server.keepAliveTimeout = 0;
        return server;
      };
    },
  },
};
