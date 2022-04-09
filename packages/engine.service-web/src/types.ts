import webpack from "webpack";
import { Configuration } from "webpack";
import { Server } from "webpack-dev-server/lib/Server";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

export type Path = string;

export type State = {
  triggers: {
    config: {
      path: string;
      timestamp: number;
    };
  };
  config: {
    name: string;
    version: string;
    commandPath: Path;
    packagePath: Path;
    configPath: Path;
    srcPath: Path;
    entryPath: Path;
    distPath: Path;
    publicPath: Path;
    publicIndexPath: Path;
    nodeModulesPath: Path;
    overrideModulesPath: Path;
    replacerPath: Path;
    packageNodeModulesPath: Path;
    exportAppStructure: boolean;
  };
  test: {
    flags: Record<string, unknown>;
    config: Record<string, unknown>;
    triggers: {
      init: {
        opts: unknown;
        timestamp: number;
      };
    };
  };
  start: {
    flags: Record<string, unknown>;
    config: Record<string, unknown>;
    triggers: {
      init: {
        opts: unknown;
        timestamp: number;
      };
    };
  };
  build: {
    flags: Record<string, unknown>;
    config: Record<string, unknown>;
    triggers: {
      init: {
        opts: unknown;
        timestamp: number;
      };
    };
  };
  err: {
    on: any;
  };
};

type ConfigFn<T> = (config: T, resolve: typeof require.resolve) => T;

export type EngineConfig = {
  name?: string;
  exportAppStructure?: boolean;
  webpack?: {
    publicPath?: string;
    production?: {
      plugins?: {
        miniCssExtractPlugin: ConfigFn<
          ConstructorParameters<typeof MiniCssExtractPlugin>
        >;
        htmlWebpackPlugin?: ConfigFn<HtmlWebpackPlugin.Options>;
        definePlugin?: ConfigFn<
          ConstructorParameters<typeof webpack.DefinePlugin>[0]
        >;
      };
      config: ConfigFn<Configuration>;
    };
    development?: {
      devServer?: ConfigFn<Server.Configuration>;
      plugins?: {
        htmlWebpackPlugin?: ConfigFn<HtmlWebpackPlugin.Options>;
        definePlugin?: ConfigFn<
          ConstructorParameters<typeof webpack.DefinePlugin>[0]
        >;
      };
      config: ConfigFn<Configuration>;
    };
  };
};
