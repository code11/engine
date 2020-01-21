export const getOrderedParams = (data: any, order: string[]): any[] => {
  return order.reduce((acc, x) => {
    acc.push(data[x]);
    return acc;
  }, [] as any[]);
};
