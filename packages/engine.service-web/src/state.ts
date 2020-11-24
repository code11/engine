export type Path = string;

export type State = {
  config: {
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
