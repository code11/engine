import ncp from "ncp";
import { State } from "../state";

type props = {
  boo: State["config"];
  _ncp: typeof ncp;
  foo: typeof observe.create.config.appName;
  bar: Update<typeof observe.create.flags.isPackageJsonReady>;
  baz: Update<typeof observe.create.flags>;
  bam: Get<typeof observe.create.config.targetPath>;
};

export const sample: producer = ({
  _ncp = ncp,
  foo = observe.create.config.appName,
  bar = update.create.flags.isPackageJsonReady,
  baz = update.create.flags[param.flagName],
  bam = get.create.config.targetPath,
}: props) => {
  foo; // string
  bar.set(true); // ok
  bam.value(); // string
  // baz.set(false, {
  //   flagName: "isPackageJsonReady",
  // });
};
