import webpack, { Configuration } from "webpack";
import WebpackDevServer from "webpack-dev-server";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { existsSync } from "fs";
import { EngineConfig } from "../types";

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
  exportAppStructure: Get<State["config"]["exportAppStructure"]>;
  name: Get<State["config"]["name"]>;
  configPath: Get<State["config"]["configPath"]>;
};

//TODO: enforce block statement

//TODO: add prefix for relative paths to avoid
//  nesting e.g.
//  import { foo } from '../../../foos'
//  and have import { foo } from 'src/foos'
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
  exportAppStructure = get.config.exportAppStructure,
  packageNodeModulesPath = get.config.packageNodeModulesPath,
  configPath = get.config.configPath,
  name = get.config.name,
}: props) => {
  if (!trigger) {
    return;
  }

  //TODO: if the engine.babel-plugin-syntax has an output flag
  // then we need to delete the .cache folder from node_modules
  // in order to trigger babel to recompile all files

  //TODO: add support for json loading using import syntax:
  // import foo from './something.json'

  let webpackConfig: EngineConfig["webpack"];
  try {
    if (existsSync(configPath.value())) {
      webpackConfig = require(configPath.value())?.webpack;
    }
  } catch (error) {
    console.error("Could not extend the webpack config", error);
  }

  if (!webpackConfig) {
    webpackConfig = {};
  }

  if (!webpackConfig.publicPath) {
    //TODO: have a place to store defaults
    webpackConfig.publicPath = "/";
  }

  const plugins = {
    htmlWebpackPlugin: {
      title: name.value(),
      template: publicIndexPath.value(),
      templateParameters: {
        PUBLIC_URL: webpackConfig.publicPath,
      },
    } as HtmlWebpackPlugin.Options,
    definePlugin: {
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "development"
      ),
      "process.env.DEBUG": JSON.stringify(process.env.DEBUG),
    } as ConstructorParameters<typeof webpack.DefinePlugin>[0],
  };

  if (webpackConfig.development?.plugins?.htmlWebpackPlugin) {
    plugins.htmlWebpackPlugin =
      webpackConfig.development?.plugins?.htmlWebpackPlugin(
        plugins.htmlWebpackPlugin,
        require.resolve
      );
  }

  if (webpackConfig.development?.plugins?.definePlugin) {
    plugins.definePlugin = webpackConfig.development.plugins.definePlugin(
      plugins.definePlugin,
      require.resolve
    );
  }

  let devServerConfig = {
    historyApiFallback: true,
    static: publicPath.value(),
    hot: true,
  };

  if (webpackConfig.development?.devServer) {
    devServerConfig = webpackConfig.development.devServer(
      devServerConfig,
      require.resolve
    );
  }

  let config = {
    mode: "development",
    devtool: "eval-source-map",
    entry: entryPath.value(),
    output: {
      publicPath: webpackConfig.publicPath,
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
          use: [
            require.resolve("@svgr/webpack"),
            require.resolve("url-loader"),
          ],
        },
        {
          //TODO: add more extensions to this loader
          test: /\.(png|jpg|gif|webp)$/,
          use: [
            {
              loader: require.resolve("file-loader"),
              options: {
                esModule: false,
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
              loader: require.resolve("file-loader"),
              options: {
                name: "[name].[ext]",
                outputPath: "fonts/",
              },
            },
          ],
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          // exclude: fileIsES5(FILE_ENCODING),
          use: [
            {
              loader: require.resolve("babel-loader"),
              options: {
                cacheDirectory: true,
                comments: false,
                minified: false,
                presets: [
                  require.resolve("@babel/preset-env"),
                  require.resolve("@babel/preset-react"),
                ],
                plugins: [
                  require.resolve("babel-plugin-react-require"),
                  require.resolve("@babel/plugin-proposal-class-properties"),
                  require.resolve("@babel/plugin-transform-runtime"),
                ],
              },
            },
          ],
        },
        {
          test: /\.(ts|tsx)$/,
          use: [
            {
              loader: require.resolve("babel-loader"),
              options: {
                cacheDirectory: true,
                comments: false,
                minified: false,
                presets: [
                  {
                    plugins: [
                      [
                        require.resolve("@c11/engine.babel-plugin-syntax"),
                        {
                          viewLibrary: "@c11/engine.react",
                          output: exportAppStructure.value(),
                        },
                      ],
                      require.resolve("@c11/engine.babel-plugin-hmr"),
                    ],
                  },
                  require.resolve("@babel/preset-typescript"),
                  require.resolve("@babel/preset-env"),
                  require.resolve("@babel/preset-react"),
                ],
                plugins: [
                  require.resolve("babel-plugin-react-require"),
                  require.resolve("@babel/plugin-proposal-class-properties"),
                  require.resolve("@babel/plugin-transform-runtime"),
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
            require.resolve("style-loader"),
            {
              loader: require.resolve("css-loader"),
              options: { modules: false, importLoaders: 1 },
            },
            {
              loader: require.resolve("postcss-loader"),
              options: {
                postcssOptions: {
                  config: false,
                  plugins: [
                    require.resolve("postcss-import"),
                    [require.resolve("postcss-preset-env"), { stage: 1 }],
                  ],
                },
              },
            },
          ],
        },
        {
          test: /\.module.css$/,
          use: [
            require.resolve("style-loader"),
            require.resolve("@teamsupercell/typings-for-css-modules-loader"),
            {
              loader: require.resolve("css-loader"),
              options: {
                importLoaders: 1,
                modules: {
                  localIdentName: "[path][name]__[local]--[hash:base64:5]",
                },
                sourceMap: true,
              },
            },
            {
              loader: require.resolve("postcss-loader"),
              options: {
                postcssOptions: {
                  config: false,
                  plugins: [
                    require.resolve("postcss-import"),
                    [require.resolve("postcss-preset-env"), { stage: 1 }],
                  ],
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new _webpack.DefinePlugin(plugins.definePlugin),
      new _HtmlWebpackPlugin(plugins.htmlWebpackPlugin),
    ],
  } as Configuration;

  if (webpackConfig.development && webpackConfig.development.config) {
    config = webpackConfig.development.config(config, require.resolve);
  }

  //TODO: Account for syntax error during HMR in order to avoid
  //  having to refresh the entire application
  const server = new _WebpackDevServer(devServerConfig, _webpack(config));

  server.listen();
};
