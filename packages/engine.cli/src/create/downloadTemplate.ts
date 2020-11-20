import pacote from "pacote";

export const downloadTemplate: producer = async ({
  _pacote = pacote,
  templatePath = observe.create.config.templatePath,
  templateName = observe.create.config.templateName,
  isReady = observe.create.flags.isAppFolderReady,
  isTemplateDownloadReady = update.create.flags.isTemplateDownloadReady,
}) => {
  if (!templatePath || !templateName || !isReady) {
    return;
  }

  await _pacote.extract(templateName, templatePath);
  isTemplateDownloadReady.set(true);
};
