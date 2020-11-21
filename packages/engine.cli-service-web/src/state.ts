export type DirPath = string;

export type State = {
  config: {
    name: string;
    version: string;
    commandPath: DirPath;
    packagePath: DirPath;
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
  err: any;
};
