import { Producer } from "@c11/engine.types";
import { expectations } from "./expectations";

export type testProducerConfig = {
  name: string;
  producer: Producer;
  props: {
    [k: string]: any;
  };
  expect: expectations;
};
