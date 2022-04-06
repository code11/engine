export const StatsTab: view = ({ events = observe.events }) => {
  if (!events) {
    return;
  }
  return <pre>{JSON.stringify(events, null, " ")}</pre>;
};
