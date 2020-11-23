import { writeFile } from "fs";
import { promisify } from "util";
import { performance } from "perf_hooks";

const pWriteFile = promisify(writeFile);

type props = {
  _writeFile: typeof pWriteFile;
  _now: typeof performance.now;
  isTemplateCopyReady: State["create"]["flags"]["isTemplateCopyReady"];
  isTemplateConfigReady: State["create"]["flags"]["isTemplateConfigReady"];
  tsConfigPath: Get<State["create"]["config"]["targetTsConfigPath"]>;
  flag: Update<State["create"]["flags"]["isTsConfigReady"]>;
};

export const writeTsConfig: producer = async ({
  _writeFile = pWriteFile,
  _now = performance.now,
  isTemplateCopyReady = observe.create.flags.isTemplateCopyReady,
  isTemplateConfigReady = observe.create.flags.isTemplateConfigReady,
  tsConfigPath = get.create.config.targetTsConfigPath,
  flag = update.create.flags.isTsConfigReady,
}: props) => {
  if (!isTemplateConfigReady || !isTemplateCopyReady) {
    return;
  }

  const targetPath = tsConfigPath.value();

  if (!targetPath) {
    throw new Error("Missing values");
  }

  const config = {
    compilerOptions: {
      target: "es5",
      moduleResolution: "node",
      module: "commonjs",
      declaration: true,
      inlineSourceMap: true,
      experimentalDecorators: true,
      esModuleInterop: true,
      strict: true,
      noUnusedLocals: false,
      noUnusedParameters: false,
      noImplicitReturns: true,
      noFallthroughCasesInSwitch: true,
      traceResolution: false,
      listEmittedFiles: false,
      listFiles: false,
      pretty: true,
      lib: ["es2017", "dom"],
      types: ["node", "jest", "react"],
      jsx: "react",
      outDir: "./dist",
    },
    exclude: ["node_modules", "dist", "**/*.spec.ts*"],
    compileOnSave: false,
    include: ["./src"],
  };

  await _writeFile(targetPath, JSON.stringify(config, null, " "), "utf-8");
  flag.set(_now());
};
