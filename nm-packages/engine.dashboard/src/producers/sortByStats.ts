export const sortByStats: producer = ({
  stats = observe.structure.stats,
  sortBy = observe.structure.sortBy,
  activeTab = observe.activeTab,
  byType = get.structure.byType,
  updateSorted = update.structure.sortedByStats,
}) => {
  if (!stats || !activeTab) {
    return;
  }

  let ids = byType.value()[activeTab.toLowerCase()];
  if (!ids || ids.length === 0) {
    return;
  }

  if (!sortBy) {
    updateSorted.set(ids);
    return;
  }

  const result = Object.entries(stats)
    .filter((x) => ids.includes(x[0]))
    .sort((a, b) => b[1][sortBy] - a[1][sortBy])
    .map((x) => x[0]);

  updateSorted.set(result);
};
