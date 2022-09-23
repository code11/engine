export const structureViewsCount: producer = ({
  views = observe.structure.byType.views,
  updateCount = update.structure.count.views,
}) => {
  if (!views) {
    updateCount.set(0);
    return;
  }

  updateCount.set(views.length);
};
