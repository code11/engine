import { testProducer } from "@c11/engine.test";
import { greeting } from "./greeting";

testProducer({
  name: "should work",
  producer: greeting,
  props: {
    name: "foo",
  },
  expect: {
    greeting: {
      set: ["Hello foo"],
    },
  },
});
