export const structureByType: producer = ({
  structure = observe.structure.elements,
  updateByType = update.structure.byType,
}) => {
  if (!structure) {
    return;
  }

  const result = Object.values(structure).reduce(
    (acc, x) => {
      if (x.type === "view") {
        acc.views.push(x.buildId);
      } else if (x.type === "producer") {
        acc.producers.push(x.buildId);
      }
      return acc;
    },
    {
      views: [],
      producers: [],
    }
  );
  updateByType.set(result);
};
