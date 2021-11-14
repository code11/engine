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
