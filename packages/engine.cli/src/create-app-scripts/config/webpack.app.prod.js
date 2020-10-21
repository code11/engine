const Webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const babelConfig = require("./babel.config");
const postCSSConfig = require("./postcss.config");
const paths = require("../utils/paths");

const FILE_LOADER_NAME_PATTERN = "[name].[ext]?[hash]";
const FILE_LOADER_OUTPUT_PATH = "assets";

module.exports = {
  mode: "production",
  devtool: "source-map",
  entry: paths.entrypoint,
  output: {
    path: paths.distApp,
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules\/(?!@[a-z]+\/components.*)/,
        // exclude: fileIsES5('UTF-8'),
        use: [
          {
            loader: require.resolve("babel-loader"),
            options: babelConfig,
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "/",
            },
          },

          {
            loader: "css-loader",
            options: { modules: true, importLoaders: 1, sourceMap: true },
          },
          {
            loader: "postcss-loader",
            options: postCSSConfig,
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
    new Webpack.ProvidePlugin({
      React: "react",
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new HtmlWebpackPlugin({
      template: paths.htmlTemplate,
      filename: "index.html"
    }),
  ],
  optimization: {
    runtimeChunk: "single",
    minimize: true,
    namedModules: false,
    namedChunks: false,
    moduleIds: "hashed",
    nodeEnv: "production",
    usedExports: true,
  },
};
