export const isView = (x: unknown): boolean => {
  return (
    // @ts-ignore
    x && typeof x === "function" && typeof x.isView === "boolean" && x.isView
  );
};
