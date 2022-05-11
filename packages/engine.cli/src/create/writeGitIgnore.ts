import { writeFile, readFile, unlink, existsSync } from "fs";
import { promisify } from "util";

const pWriteFile = promisify(writeFile);
const pReadFile = promisify(readFile);
const pUnlink = promisify(unlink);

type props = {
  _writeFile: typeof pWriteFile;
  _existsSync: typeof existsSync;
  _readFile: typeof pReadFile;
  _unlink: typeof pUnlink;
  _now: () => number;
  isTemplateCopyReady: State["create"]["flags"]["isTemplateCopyReady"];
  isTemplateConfigReady: State["create"]["flags"]["isTemplateConfigReady"];
  copiedGitIgnorePath: Get<State["create"]["config"]["copiedGitIgnorePath"]>;
  templateGitIgnorePath: Get<
    State["create"]["config"]["templateGitIgnorePath"]
  >;
  gitIgnorePath: Get<State["create"]["config"]["targetGitIgnorePath"]>;
  flag: Update<State["create"]["flags"]["isGitIgnoreReady"]>;
};

export const writeGitIgnore: producer = async ({
  _writeFile = pWriteFile,
  _readFile = pReadFile,
  _unlink = pUnlink,
  _existsSync = existsSync,
  _now,
  isTemplateCopyReady = observe.create.flags.isTemplateCopyReady,
  isTemplateConfigReady = observe.create.flags.isTemplateConfigReady,
  gitIgnorePath = get.create.config.targetGitIgnorePath,
  templateGitIgnorePath = get.create.config.templateGitIgnorePath,
  copiedGitIgnorePath = get.create.config.copiedGitIgnorePath,
  flag = update.create.flags.isGitIgnoreReady,
}: props) => {
  if (!isTemplateConfigReady || !isTemplateCopyReady) {
    return;
  }

  const targetPath = gitIgnorePath.value();

  if (!targetPath) {
    throw new Error("Missing values");
  }

  let content: string;
  if (
    templateGitIgnorePath.value() &&
    _existsSync(templateGitIgnorePath.value())
  ) {
    content = await _readFile(templateGitIgnorePath.value(), "utf-8");
  } else {
    content = `
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
app-structure.json
`;
  }

  await _writeFile(targetPath, content, "utf-8");
  if (copiedGitIgnorePath.value()) {
    await _unlink(copiedGitIgnorePath.value());
  }

  flag.set(_now());
};
