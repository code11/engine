import { ProducerFn } from "@c11/engine.types";
import { expectations } from "./expectations";

export type testProducerConfig = {
  name: string;
  producer: ProducerFn;
  props: {
    [k: string]: any;
  };
  expect: expectations;
};
