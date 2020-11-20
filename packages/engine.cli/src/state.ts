export type DirPath = string;

export enum CreateTemplateTarget {
  NODE = "node",
  WEB = "web",
}

export type EngineScripts = {
  target: CreateTemplateTarget;
  packageName: string;
  binName: string;
  version: string;
};

export type State = {
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
