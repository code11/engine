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
  overrideModulesPath: Get<State["config"]["overrideModulesPath"]>;
  replacerPath: Get<State["config"]["replacerPath"]>;
};

export const init: producer = ({
  _webpack = webpack,
  _WebpackDevServer = WebpackDevServer,
  _HtmlWebpackPlugin = HtmlWebpackPlugin,
  trigger = observe.start.triggers.init,
  entryPath = get.config.entryPath,
  distPath = get.config.distPath,
  publicIndexPath = get.config.publicIndexPath,
  packagePath = get.config.packagePath,
  nodeModulesPath = get.config.nodeModulesPath,
  overrideModulesPath = get.config.overrideModulesPath,
  replacerPath = get.config.replacerPath,
}: props) => {
  if (!trigger) {
    return;
  }

  const config = {
    mode: "development",
    devtool: "eval-source-map",
    entry: entryPath.value(),
    output: {
      path: distPath.value(),
    },
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    module: {
      rules: [
        {
          test: /\.(png|jpg|gif|webp|svg)$/,
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
                        "@c11/babel-plugin-engine",
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
                  plugins: [
                    require("postcss-import"),
                    require("tailwindcss"),
                    require("postcss-preset-env")({ stage: 1 }),
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
      }),
    ],
  } as Configuration;

  const server = new _WebpackDevServer(_webpack(config));

  server.listen(8081, "0.0.0.0");
};
