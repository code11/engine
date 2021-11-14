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
  proxy: Get<State["config"]["proxy"]>;
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
  proxy = get.config.proxy,
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
    //TODO: error needs to be shown in full. There are errors
    //  that can occur from the file itself that will propagate here
    //  and lead to false messages
    if (e.code === "MODULE_NOT_FOUND") {
      console.log(
        "tailwind.config.js not found. Using default tailwindcss theme."
      );
    } else {
      throw e;
    }
  }

  //TODO: if the engine.babel-plugin-syntax has an output flag
  // then we need to delete the .cache folder from node_modules
  // in order to trigger babel to recompile all files

  //TODO: add support for json loading using import syntax:
  // import foo from './something.json'

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
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          // exclude: fileIsES5(FILE_ENCODING),
          use: [
            {
              loader: "babel-loader",
              options: {
                cacheDirectory: true,
                comments: false,
                minified: false,
                presets: ["@babel/preset-env", "@babel/preset-react"],
                plugins: [
                  "babel-plugin-react-require",
                  "@babel/plugin-proposal-class-properties",
                  "@babel/plugin-transform-runtime",
                ],
              },
            },
          ],
        },
        {
          test: /\.(ts|tsx)$/,
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
                modules: {
                  localIdentName: "[path][name]__[local]--[hash:base64:5]",
                },
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
        "process.env.NODE_ENV": JSON.stringify(
          process.env.NODE_ENV || "development"
        ),
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

  //TODO: Account for syntax error during HMR in order to avoid
  //  having to refresh the entire application
  const server = new _WebpackDevServer(
    {
      proxy: proxy.value(),
      historyApiFallback: true,
      static: publicPath.value(),
      hot: true,
    },
    _webpack(config)
  );

  //TODO: in case 8081 is busy, try 8082, 8083...
  server.listen(8081, "0.0.0.0");
};
