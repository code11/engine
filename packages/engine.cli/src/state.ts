export type DirPath = string;

export enum CreateTemplateTarget {
  NODE = "node",
  WEB = "web",
}

export type EngineScript = {
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
      [k in CreateTemplateTarget]: EngineScript;
    };
  };
  create: {
    flags: {
      isAppFolderReady: number;
      isTemplateDownloadReady: number;
      isTemplateCopyReady: number;
      isPackageJsonReady: number;
      isDependencyInstallReady: number;
      isTemplateConfigReady: number;
      isTsConfigReady: number;
      isGitIgnoreReady: number;
      isSetupReady: number;
      isCleanupReady: number;
    };
    config: {
      appName: string;
      templateName: string;
      targetPath: DirPath;
      tmpPath: DirPath;
      templatePath: DirPath;
      templateSandboxPath: DirPath;
      templateConfigFilePath: DirPath;
      templateGitIgnorePath: DirPath;
      targetPackageJsonPath: DirPath;
      targetTsConfigPath: DirPath;
      targetGitIgnorePath: DirPath;
      copiedGitIgnorePath: DirPath;
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
