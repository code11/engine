export const start: producer = ({
  trigger = observe.create.triggers.start,
  appName = update.create.config.appName,
  templateName = update.create.config.templateName,
}) => {
  if (!trigger) {
    return;
  }
  appName.set(trigger.name);
  templateName.set(trigger.template);
};
