export type Path = string;

export type State = {
  config: {
    proxy:
      | string
      | {
          [k: string]: string;
        };
    name: string;
    version: string;
    commandPath: Path;
    packagePath: Path;
    srcPath: Path;
    entryPath: Path;
    distPath: Path;
    publicPath: Path;
    publicIndexPath: Path;
    nodeModulesPath: Path;
    overrideModulesPath: Path;
    replacerPath: Path;
    packageNodeModulesPath: Path;
    tailwindConfigPath: Path;
  };
  test: {
    flags: {};
    config: {};
    triggers: {
      init: {
        opts: any;
        timestamp: number;
      };
    };
  };
  start: {
    flags: {};
    config: {};
    triggers: {
      init: {
        opts: any;
        timestamp: number;
      };
    };
  };
  build: {
    flags: {};
    config: {};
    triggers: {
      init: {
        opts: any;
        timestamp: number;
      };
    };
  };
  err: any;
};
