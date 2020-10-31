import { ProducerConfig } from "@c11/engine.types";
import { expectations } from "./expectations";

export type testProducerConfig = {
  producer: ProducerConfig;
  values: object;
  expectations: expectations;
};
