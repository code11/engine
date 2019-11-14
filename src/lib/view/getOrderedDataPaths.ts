import { BaseData, DataPathStructure } from './types';

const PROP_REGEX = /<([a-zA-Z0-9]+)>/g;

/**
 * Return data paths either as string or ready for injecting props
 * Ordered based on their dependencies between themselves
 * @param data the data paths to be processed
 */
export function getOrderedDataPaths(data: BaseData): DataPathStructure[] {
  const paths = Object.keys(data).reduce((acc, x: string) => {
    if (data[x].indexOf('/') === 0) {
      const vars: string[] = [];
      data[x].replace(PROP_REGEX, (_a: any, b: string, _c: any, _d: any) => {
        if (!vars.includes(b)) {
          vars.push(b);
        }
      });
      if (vars.length === 0) {
        acc.push({
          name: x,
          path: data[x]
        });
      } else {
        acc.push({
          name: x,
          vars,
          path: (vars, props) => {
            let isInvalid = false;
            const path = data[x].replace(
              PROP_REGEX,
              (_a: any, b: string, _c: any, _d: any) => {
                const value = vars[b] || props[b];
                if (typeof value !== 'string' || value.length === 0) {
                  isInvalid = true;
                  return;
                }
                return value;
              }
            );
            return isInvalid ? undefined : path;
          }
        });
      }
    }
    return acc;
  }, [] as DataPathStructure[]);

  const orderedPaths = paths.sort((a, b) => {
    if (b.vars && b.vars.includes(a.name)) {
      return -1;
    } else {
      return 1;
    }
  });

  return orderedPaths;
}
