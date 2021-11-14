import * as Babel from "@babel/core";
import { InstrumentationOutput } from "./types";
import { VariableDeclaratorVisitor } from "./visitors";
import fs from "fs";
import { join } from "path";

export type PluginConfig = {
  viewLibrary: string;
};

type PluginType = (babel: typeof Babel, state: PluginConfig) => {};

export type FileOutput = {
  [uid: string]: InstrumentationOutput;
};

// TODO: if files are deleted these should be also deleted from
// the cache (how to capture this event?)

export type OutputStructure = {
  [absoluteFilePath: string]: FileOutput;
};

export const plugin: PluginType = (babel, state) => {
  const outputFile = "engine.output.json";
  let cache = new Map<string, FileOutput>();
  let rootPath: string;
  const scheduleWrite = () => {
    let data: OutputStructure = Array.from(cache.entries()).reduce(
      (acc, [key, value]) => {
        acc[key] = value;
        return acc;
      },
      {} as { [k: string]: FileOutput }
    );

    fs.writeFile(
      join(rootPath, outputFile),
      JSON.stringify(data, null, " "),
      (err) => {
        if (err) {
          throw err;
        }
        console.log("file saved");
      }
    );
  };
  return {
    name: "@c11/engine.babel-plugin-syntax",
    visitor: {
      VariableDeclarator: VariableDeclaratorVisitor(babel, state, (output) => {
        if (!output?.meta?.absoluteFilePath) {
          return;
        }
        let fileOutput = cache.get(output.meta.absoluteFilePath);
        if (!fileOutput) {
          fileOutput = {};
        }
        fileOutput[output.buildId] = output;
        cache.set(output.meta.absoluteFilePath, fileOutput);
      }),
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
      // cache.forEach((value, key) => {
      //   console.log(key, JSON.stringify(value, null, " "));
      // });
    },
  };
};
