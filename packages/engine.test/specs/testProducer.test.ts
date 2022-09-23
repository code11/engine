import "./global.ts";
import { testProducer } from "../src";

const foo: producer = ({ bam = observe.bam, baz = update.baz }) => {
  if (!bam) {
    return;
  }
  baz.set(bam);
};

testProducer({
  name: "it should do something",
  producer: foo,
  props: {
    bam: 123,
  },
  expect: {
    baz: {
      set: [123],
    },
  },
});
