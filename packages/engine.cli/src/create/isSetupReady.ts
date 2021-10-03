import { performance } from "perf_hooks";

type props = {
  _now: number;
  isDependencyInstallReady: State["create"]["flags"]["isDependencyInstallReady"];
  isTsConfigReady: State["create"]["flags"]["isTsConfigReady"];
  isGitIgnoreReady: State["create"]["flags"]["isGitIgnoreReady"];
  flag: Update<State["create"]["flags"]["isSetupReady"]>;
};

export const isSetupReady: producer = ({
  _now,
  isDependencyInstallReady = observe.create.flags.isDependencyInstallReady,
  isTsConfigReady = observe.create.flags.isTsConfigReady,
  isGitIgnoreReady = observe.create.flags.isGitIgnoreReady,
  flag = update.create.flags.isSetupReady,
}: props) => {
  if (!isDependencyInstallReady || !isTsConfigReady || !isGitIgnoreReady) {
    return;
  }

  flag.set(_now());
};
