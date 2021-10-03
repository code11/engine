import pacote from "pacote";
import { performance } from "perf_hooks";

type props = {
  _now: number;
  _pacote: typeof pacote;
  templatePath: State["create"]["config"]["templatePath"];
  templateName: State["create"]["config"]["templateName"];
  isReady: State["create"]["flags"]["isAppFolderReady"];
  flag: Update<State["create"]["flags"]["isTemplateDownloadReady"]>;
};

export const downloadTemplate: producer = async ({
  _now,
  _pacote = pacote,
  templatePath = observe.create.config.templatePath,
  templateName = observe.create.config.templateName,
  isReady = observe.create.flags.isAppFolderReady,
  flag = update.create.flags.isTemplateDownloadReady,
}: props) => {
  if (!templatePath || !templateName || !isReady) {
    return;
  }

  await _pacote.extract(templateName, templatePath);
  flag.set(_now());
};
