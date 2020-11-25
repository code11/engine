import { testProducer } from "@c11/engine.test";
import { greeting } from "./greeting";

testProducer({
  name: "should work",
  producer: greeting,
  props: {
    name: "foo",
    item: {
      a: "this is a",
      b: "this is b",
    },
  },
  expect: {
    greeting: {
      set: ["Hello foo"],
    },
  },
});
