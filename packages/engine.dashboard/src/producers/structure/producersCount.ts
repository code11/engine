export const structureProducersCount: producer = ({
  producers = observe.structure.byType.producers,
  updateCount = update.structure.count.producers,
}) => {
  if (!producers) {
    updateCount.set(0);
    return;
  }

  updateCount.set(producers.length);
};
