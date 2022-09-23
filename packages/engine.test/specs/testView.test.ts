import { testView } from "../src/index";
import "./global";

//@ts-ignore
const foo: view = ({ bam = observe.bam }) => {
  return null;
};

test("should work", () => {});

/*
testView({
  name: "it should do something",
  state: {},
  view: foo,
  props: {
    bam: 123,
  },
});

*/
