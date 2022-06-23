export const patchesIds: producer = ({
  patches = observe.patches.items,
  ids = update.patches.ids,
}) => {
  if (!patches) {
    ids.set([]);
    return;
  }

  const eventIds = Object.values(patches)
    .sort((a, b) => a.createdAt - b.createdAt)
    .map((x) => x.eventId);

  ids.set(eventIds);
};
