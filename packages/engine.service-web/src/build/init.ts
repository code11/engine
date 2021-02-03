import webpack, { Configuration } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { copy } from "fs-extra";

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
  tailwindConfigPath: Get<State["config"]["tailwindConfigPath"]>;
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
    mode: "production",
    devtool: "source-map",
    entry: entryPath.value(),
    output: {
      path: distPath.value(),
      filename: "[name].[contenthash:8].js",
      publicPath: "/",
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
                minified: true,
                presets: [
                  {
                    plugins: [
                      [
                        "@c11/engine.babel-plugin-syntax",
                        {
                          viewLibrary: "@c11/engine.react",
                        },
                      ],
                    ],
                  },
                  "@babel/preset-typescript",
                  "@babel/preset-env",
                  "@babel/preset-react",
                ],
                plugins: [
                  "babel-plugin-react-require",
                  "@babel/plugin-proposal-class-properties",
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
                publicPath: "/",
              },
            },
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
            {
              loader: _MiniCssExtractPlugin.loader,
              options: {
                publicPath: "/",
              },
            },
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
      // new _BundleAnalyzerPlugin(),
      new _webpack.ids.HashedModuleIdsPlugin(),
      new _webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify("production"),
        "process.env.DEBUG": JSON.stringify(false),
      }),
      new _HtmlWebpackPlugin({
        template: publicIndexPath.value(),
        templateParameters: {
          PUBLIC_URL: "",
        },
      }),
      new _MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css",
      }),
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
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];

              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace("@", "")}`;
            },
          },
        },
      },
    },
  } as Configuration;

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
