export type Path = string;

export type State = {
  triggers: {
    config: {
      path: string;
      timestamp: number;
    };
  };
  config: {
    proxy:
      | string
      | {
          [k: string]: string;
        };
    name: string;
    version: string;
    webpackPublicPath: string;
    commandPath: Path;
    packagePath: Path;
    srcPath: Path;
    isExportedAsModule: boolean;
    entryPath: Path;
    distPath: Path;
    publicPath: Path;
    publicIndexPath: Path;
    nodeModulesPath: Path;
    overrideModulesPath: Path;
    replacerPath: Path;
    packageNodeModulesPath: Path;
    tailwindConfigPath: Path;
    port: string | number;
    engineOutput: boolean;
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
  err: unknown;
};
