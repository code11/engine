import webpack, { Configuration } from "webpack";
import WebpackDevServer from "webpack-dev-server";
import HtmlWebpackPlugin from "html-webpack-plugin";

type props = {
  _webpack: typeof webpack;
  _WebpackDevServer: typeof WebpackDevServer;
  _HtmlWebpackPlugin: typeof HtmlWebpackPlugin;
  trigger: State["start"]["triggers"]["init"];
  entryPath: Get<State["config"]["entryPath"]>;
  packagePath: Get<State["config"]["packagePath"]>;
  distPath: Get<State["config"]["distPath"]>;
  publicIndexPath: Get<State["config"]["publicIndexPath"]>;
  nodeModulesPath: Get<State["config"]["nodeModulesPath"]>;
  commandPath: Get<State["config"]["commandPath"]>;
  overrideModulesPath: Get<State["config"]["overrideModulesPath"]>;
  replacerPath: Get<State["config"]["replacerPath"]>;
  publicPath: Get<State["config"]["publicPath"]>;
  packageNodeModulesPath: Get<State["config"]["packageNodeModulesPath"]>;
  tailwindConfigPath: Get<State["config"]["tailwindConfigPath"]>;
};

export const init: producer = async ({
  _webpack = webpack,
  _WebpackDevServer = WebpackDevServer,
  _HtmlWebpackPlugin = HtmlWebpackPlugin,
  trigger = observe.start.triggers.init,
  entryPath = get.config.entryPath,
  distPath = get.config.distPath,
  publicIndexPath = get.config.publicIndexPath,
  commandPath = get.config.commandPath,
  packagePath = get.config.packagePath,
  nodeModulesPath = get.config.nodeModulesPath,
  overrideModulesPath = get.config.overrideModulesPath,
  replacerPath = get.config.replacerPath,
  publicPath = get.config.publicPath,
  packageNodeModulesPath = get.config.packageNodeModulesPath,
  tailwindConfigPath = get.config.tailwindConfigPath,
}: props) => {
  if (!trigger) {
    return;
  }

  let tailwindConfig = {};
  try {
    tailwindConfig = require(tailwindConfigPath.value());
  } catch (e) {
    if (e.code === "MODULE_NOT_FOUND") {
      console.log("ok - not found");
    } else {
      throw e;
    }
  }

  const config = {
    mode: "development",
    devtool: "eval-source-map",
    entry: entryPath.value(),
    output: {
      publicPath: "/",
      path: distPath.value(),
    },
    resolve: {
      modules: ["node_modules", commandPath.value()],
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    resolveLoader: {
      modules: [nodeModulesPath.value(), packageNodeModulesPath.value()],
    },
    module: {
      rules: [
        {
          test: /\.svg$/,
          use: ["@svgr/webpack", "url-loader"],
        },
        {
          test: /\.(png|jpg|gif|webp)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]?[hash]",
                outputPath: "assets",
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
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          // exclude: fileIsES5(FILE_ENCODING),
          use: [
            {
              loader: "babel-loader",
              options: {
                cacheDirectory: true,
                comments: false,
                minified: false,
                presets: [
                  {
                    plugins: [
                      [
                        "@c11/engine.babel-plugin-syntax",
                        {
                          viewLibrary: "@c11/engine.react",
                        },
                      ],
                      "@c11/engine.babel-plugin-hmr",
                    ],
                  },
                  "@babel/preset-typescript",
                  "@babel/preset-env",
                  "@babel/preset-react",
                ],
                plugins: [
                  "babel-plugin-react-require",
                  "@babel/plugin-proposal-class-properties",
                  "@babel/plugin-transform-runtime",
                  // [
                  //   "babel-plugin-module-rewrite",
                  //   {
                  //     replaceFunc: replacerPath.value(),
                  //     replaceHandlerName: "replacer",
                  //     overrideModulesPath: overrideModulesPath.value(),
                  //     nodeModulesPath: nodeModulesPath.value(),
                  //   },
                  // ],
                ],
              },
            },
          ],
        },
        {
          test: /\.css$/,
          exclude: /\.module\.css$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: { modules: false, importLoaders: 1 },
            },
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  config: false,
                  plugins: [
                    "postcss-import",
                    ["tailwindcss", { config: tailwindConfig }],
                    ["postcss-preset-env", { stage: 1 }],
                  ],
                },
              },
            },
          ],
        },
        {
          test: /\.module.css$/,
          use: [
            "style-loader",
            "@teamsupercell/typings-for-css-modules-loader",
            {
              loader: "css-loader",
              options: {
                importLoaders: 1,
                modules: true,
                sourceMap: true,
              },
            },
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  config: false,
                  plugins: [
                    "postcss-import",
                    ["tailwindcss", { config: tailwindConfig }],
                    ["postcss-preset-env", { stage: 1 }],
                  ],
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      // new Webpack.HotModuleReplacementPlugin(),
      // new _webpack.EnvironmentPlugin({ NODE_ENV: "development" }),
      new _webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        "process.env.DEBUG": JSON.stringify(process.env.DEBUG),
      }),
      new _HtmlWebpackPlugin({
        template: publicIndexPath.value(),
        templateParameters: {
          PUBLIC_URL: "",
        },
      }),
    ],
  } as Configuration;

  const server = new _WebpackDevServer(_webpack(config), {
    historyApiFallback: {
      index: "index.html",
    },
    contentBase: publicPath.value(),
    hot: true,
  });

  server.listen(8081, "0.0.0.0");
};
