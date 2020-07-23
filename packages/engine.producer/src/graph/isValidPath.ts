export const isValidPath = (path: any) => {
  return !(!path || path.includes(undefined) || path.includes(null));
};
