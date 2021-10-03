import { writeFile } from "fs";
import { promisify } from "util";
import { performance } from "perf_hooks";

const pWriteFile = promisify(writeFile);

type props = {
  _writeFile: typeof pWriteFile;
  _now: number;
  isTemplateCopyReady: State["create"]["flags"]["isTemplateCopyReady"];
  isTemplateConfigReady: State["create"]["flags"]["isTemplateConfigReady"];
  gitIgnorePath: Get<State["create"]["config"]["targetGitIgnorePath"]>;
  flag: Update<State["create"]["flags"]["isGitIgnoreReady"]>;
};

export const writeGitIgnore: producer = async ({
  _writeFile = pWriteFile,
  _now,
  isTemplateCopyReady = observe.create.flags.isTemplateCopyReady,
  isTemplateConfigReady = observe.create.flags.isTemplateConfigReady,
  gitIgnorePath = get.create.config.targetGitIgnorePath,
  flag = update.create.flags.isGitIgnoreReady,
}: props) => {
  if (!isTemplateConfigReady || !isTemplateCopyReady) {
    return;
  }

  const targetPath = gitIgnorePath.value();

  if (!targetPath) {
    throw new Error("Missing values");
  }

  const content = `
.scannerwork
.settings
.externalToolBuilders/
.idea/
.classpath
.project
target
/www
/www/*

.bin/*
.bin/**
**/.bin/*
node_modules/**
*/node_modules/*
*/node_modules/**
*/node_modules
**/node_modules
bower_components/**
*.log
.vscode
dist
\.htmlhintrc

*.code-workspace
.history
/.gtm/
.infra
`;

  await _writeFile(targetPath, content, "utf-8");
  flag.set(_now());
};
