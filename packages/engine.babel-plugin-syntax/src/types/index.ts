import * as Babel from "@babel/core";
import type {
  PassthroughOperation,
  ProducerMeta,
  StructOperation,
} from "@c11/engine.types";
import { EngineKeywords } from "@c11/engine.types";

export type InstrumentationOutput = {
  type: EngineKeywords;
  sourceId: string;
  buildId: string;
  meta: ProducerMeta;
  params: PassthroughOperation | StructOperation;
};

export type PluginConfig = {
  viewLibrary: string;
  output: boolean;
};

export type PluginType = (babel: typeof Babel, state: PluginConfig) => {};

export type FileOutput = {
  [uid: string]: InstrumentationOutput;
};

// TODO: if files are deleted these should be also deleted from
// the cache (how to capture this event?)

export type OutputStructure = {
  [absoluteFilePath: string]: FileOutput;
};
