import fs from "fs";
import { join } from "path";
import {
  PluginType,
  FileOutput,
  OutputStructure,
  InstrumentationOutput,
} from "./types";
import * as Babel from "@babel/core";
import { VariableDeclaratorVisitor } from "./visitors";

export const withOutput: PluginType = (babel, state) => {
  const outputFile = ".app-structure.json";
  const cache = new Map<string, FileOutput>();
  let rootPath: string;
  let writeTimeout: NodeJS.Timeout;
  // 1 second should be enough time between compiles
  // in order to do the dump safely
  const silenceTimeout = 1000;
  const scheduleWrite = () => {
    clearTimeout(writeTimeout);
    writeTimeout = setTimeout(writeFromCache, silenceTimeout);
  };
  const writeFromCache = () => {
    const data: OutputStructure = Array.from(cache.entries()).reduce(
      (acc, [key, value]) => {
        acc[key] = value;
        return acc;
      },
      {} as { [k: string]: FileOutput }
    );

    fs.writeFile(
      join(rootPath, outputFile),
      JSON.stringify(data, null, " "),
      (err: unknown) => {
        if (err) {
          throw err;
        }
      }
    );
  };

  const onDone = (output: InstrumentationOutput) => {
    if (!output?.meta?.absoluteFilePath) {
      return;
    }
    let fileOutput = cache.get(output.meta.absoluteFilePath);
    if (!fileOutput) {
      fileOutput = {};
    }
    fileOutput[output.buildId] = output;
    cache.set(output.meta.absoluteFilePath, fileOutput);
  };
  return {
    name: "@c11/engine.babel-plugin-syntax",
    visitor: {
      VariableDeclarator: VariableDeclaratorVisitor(babel, state, onDone),
    },
    pre(state: Babel.PluginPass) {
      const opts = state?.opts as { filename: string; root: string };
      if (!rootPath) {
        rootPath = opts.root;
      }
      if (opts?.filename) {
        cache.delete(opts.filename);
      }
    },
    post() {
      scheduleWrite();
    },
  };
};
