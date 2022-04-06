export const circular = () => {
  const seen = new WeakSet();
  return (key: string, value: any) => {
    if (key.startsWith("_")) {
      return;
    }
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};
