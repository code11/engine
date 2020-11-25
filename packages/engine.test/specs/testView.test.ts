import { testView } from "../src/index";
import "./global";

const foo: view = ({ bam = observe.bam }) => {
  return null;
};

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
