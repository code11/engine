import webpack, { Configuration } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { copy } from "fs-extra";
import { randomId } from "@c11/engine.utils";
import { existsSync } from "fs";
import { EngineConfig } from "../types";

type props = {
  _webpack: typeof webpack;
  _copy: typeof copy;
  _HtmlWebpackPlugin: typeof HtmlWebpackPlugin;
  _BundleAnalyzerPlugin: typeof BundleAnalyzerPlugin;
  _MiniCssExtractPlugin: typeof MiniCssExtractPlugin;
  trigger: State["build"]["triggers"]["init"];
  entryPath: Get<State["config"]["entryPath"]>;
  packagePath: Get<State["config"]["packagePath"]>;
  distPath: Get<State["config"]["distPath"]>;
  publicIndexPath: Get<State["config"]["publicIndexPath"]>;
  commandPath: Get<State["config"]["commandPath"]>;
  publicPath: Get<State["config"]["publicPath"]>;
  nodeModulesPath: Get<State["config"]["nodeModulesPath"]>;
  overrideModulesPath: Get<State["config"]["overrideModulesPath"]>;
  replacerPath: Get<State["config"]["replacerPath"]>;
  packageNodeModulesPath: Get<State["config"]["packageNodeModulesPath"]>;
  name: Get<State["config"]["name"]>;
  configPath: Get<State["config"]["configPath"]>;
};

export const init: producer = async ({
  _webpack = webpack,
  _copy = copy,
  _HtmlWebpackPlugin = HtmlWebpackPlugin,
  _BundleAnalyzerPlugin = BundleAnalyzerPlugin,
  _MiniCssExtractPlugin = MiniCssExtractPlugin,
  trigger = observe.build.triggers.init,
  entryPath = get.config.entryPath,
  distPath = get.config.distPath,
  publicIndexPath = get.config.publicIndexPath,
  publicPath = get.config.publicPath,
  commandPath = get.config.commandPath,
  packagePath = get.config.packagePath,
  nodeModulesPath = get.config.nodeModulesPath,
  overrideModulesPath = get.config.overrideModulesPath,
  replacerPath = get.config.replacerPath,
  packageNodeModulesPath = get.config.packageNodeModulesPath,
  configPath = get.config.configPath,
  name = get.config.name,
}: props) => {
  if (!trigger) {
    return;
  }

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
    miniCssExtractPlugin: {
      filename: "[name].css",
      chunkFilename: "[id].css",
    },
    definePlugin: {
      "process.env.NODE_ENV": JSON.stringify("production"),
      "process.env.DEBUG": JSON.stringify(false),
    } as ConstructorParameters<typeof webpack.DefinePlugin>[0],
  };

  if (webpackConfig.production?.plugins?.htmlWebpackPlugin) {
    plugins.htmlWebpackPlugin =
      webpackConfig.production?.plugins?.htmlWebpackPlugin(
        plugins.htmlWebpackPlugin,
        require.resolve
      );
  }

  if (webpackConfig.production?.plugins?.definePlugin) {
    plugins.definePlugin = webpackConfig.production.plugins.definePlugin(
      plugins.definePlugin,
      require.resolve
    );
  }

  let config = {
    mode: "production",
    devtool: "source-map",
    entry: entryPath.value(),
    output: {
      path: distPath.value(),
      filename: "[name].[contenthash:8].js",
      publicPath: webpackConfig.publicPath,
    },
    resolve: {
      modules: ["node_modules", commandPath.value()],
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    resolveLoader: {
      modules: [nodeModulesPath.value(), packageNodeModulesPath.value()],
      extensions: [".js", ".jsx", ".ts", ".tsx"],
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
                minified: true,
                presets: [
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
          test: /\.(ts|tsx)$/,
          // exclude: fileIsES5(FILE_ENCODING),
          use: [
            {
              loader: require.resolve("babel-loader"),
              options: {
                cacheDirectory: true,
                comments: false,
                minified: true,
                presets: [
                  {
                    plugins: [
                      [
                        require.resolve("@c11/engine.babel-plugin-syntax"),
                        {
                          viewLibrary: "@c11/engine.react",
                        },
                      ],
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
            {
              loader: _MiniCssExtractPlugin.loader,
              options: {
                publicPath: webpackConfig.publicPath,
              },
            },
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
            {
              loader: _MiniCssExtractPlugin.loader,
              options: {
                publicPath: webpackConfig.publicPath,
              },
            },
            {
              loader: require.resolve("css-loader"),
              options: {
                importLoaders: 1,
                modules: true,
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
      // new _BundleAnalyzerPlugin(),
      new _webpack.ids.HashedModuleIdsPlugin(),
      new _webpack.DefinePlugin(plugins.definePlugin),
      new _HtmlWebpackPlugin(plugins.htmlWebpackPlugin),
      new _MiniCssExtractPlugin(plugins.miniCssExtractPlugin),
    ],
    optimization: {
      runtimeChunk: "single",
      splitChunks: {
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const parts = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              );
              const packageName = parts && parts[1] ? parts[1] : randomId();

              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace("@", "")}`;
            },
          },
        },
      },
    },
  } as Configuration;

  if (webpackConfig.production && webpackConfig.production.config) {
    config = webpackConfig.production.config(config, require.resolve);
  }

  await _copy(publicPath.value(), distPath.value(), {
    dereference: true,
    filter: (file) => file !== publicIndexPath.value(),
  });

  _webpack(config, (err, stats) => {
    if (err) {
      console.error(err.stack || err);
      return;
    }
    if (stats) {
      const info = stats.toJson();
      if (stats.hasErrors()) {
        console.error(info.errors);
      }
      if (stats.hasWarnings()) {
        console.warn(info.warnings);
      }
      console.log(stats.toString());
    }
    console.log(`Build complete`);
  });
};
