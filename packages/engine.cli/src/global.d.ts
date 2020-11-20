type DirPath = string;

declare enum CreateTemplateTarget {
  NODE = "node",
  WEB = "web",
}

type EngineScripts = {
  target: CreateTemplateTarget;
  packageName: string;
  binName: string;
  version: string;
};

declare type State = {
  config: {
    name: string;
    version: string;
    commandPath: DirPath;
    packagePath: DirPath;
    scripts: {
      [k in CreateTemplateTarget]: EngineScripts;
    };
  };
  create: {
    flags: {
      isAppFolderReady: boolean;
      isTemplateDownloadReady: boolean;
      isTemplateCopyReady: boolean;
      isPackageJsonReady: boolean;
      isDependencyInstallReady: boolean;
    };
    config: {
      appName: string;
      templateName: string;
      targetPath: DirPath;
      tmpPath: DirPath;
      templatePath: DirPath;
      templateSandboxPath: DirPath;
      templateConfigFilePath: DirPath;
    };
    templateConfig: {
      target: CreateTemplateTarget;
      package: any;
    };
    triggers: {
      start: {
        name: string;
        template: string;
      };
    };
  };
  err: any;
};
declare type producer = any;
declare const observe: State;
declare const get: any;
declare const update: any;
declare const prop: any;
declare const param: any;
declare const arg: any;
