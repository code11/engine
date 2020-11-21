import pacote from "pacote";

type props = {
  _pacote: typeof pacote;
  templatePath: State["create"]["config"]["templatePath"];
  templateName: State["create"]["config"]["templateName"];
  isReady: State["create"]["flags"]["isAppFolderReady"];
  isTemplateDownloadReady: Update<
    State["create"]["flags"]["isTemplateDownloadReady"]
  >;
};

export const downloadTemplate: producer = async ({
  _pacote = pacote,
  templatePath = observe.create.config.templatePath,
  templateName = observe.create.config.templateName,
  isReady = observe.create.flags.isAppFolderReady,
  isTemplateDownloadReady = update.create.flags.isTemplateDownloadReady,
}: props) => {
  if (!templatePath || !templateName || !isReady) {
    return;
  }

  await _pacote.extract(templateName, templatePath);
  isTemplateDownloadReady.set(true);
};
