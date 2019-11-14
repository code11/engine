import { BaseData, BaseProps } from '../types';
import htmlElementAttributes from 'react-html-attributes';

htmlElementAttributes['*'];

const PROP_REGEX = /<([a-zA-Z0-9]+)>/g;

export interface PropsStructure {
  internal: string[];
  external: string[];
  links: { [key: string]: string };
  receivedProps: BaseProps;
}

// Get props structure
// Validate Props against structure

// What props does the component require from the outside?
// What props are default?
// How do overwriting of props happen?
// What props are needed by paths?
// Check if a prop can be kept on an element and remove props that can't be used (with a warning)

/**
 * Processes data bindings and figures out what properties should be
 * provided to the component at run-time
 * @param data the data schema containing paths and props
 */
export function getPropsStructure(data: BaseData, props: any): PropsStructure {
  const types = Object.keys(data).reduce(
    (acc, x: string) => {
      if (data[x].indexOf('/') === 0) {
        acc.paths.push(x);
      } else if (data[x].indexOf('<') === 0) {
        const prop = data[x].replace('<', '').replace('>', '');
        acc.externalProps.push(prop);
        acc.internalProps.push(x);
        acc.links[x] = prop;
      }
      return acc;
    },
    {
      internalProps: [] as string[],
      externalProps: [] as string[],
      links: {} as { [key: string]: string },
      paths: [] as string[]
    }
  );

  const usedProps = types.paths.reduce((acc, x) => {
    data[x].replace(PROP_REGEX, (_a: any, b: string, _c: any, _d: any) => {
      if (
        acc.indexOf(b) === -1 &&
        !types.paths.includes(b) &&
        !types.internalProps.includes(b) &&
        b !== 'viewId' &&
        b !== 'viewPath'
      ) {
        acc.push(b);
      }
    });
    return acc;
  }, [] as string[]);

  const structure = {
    external: types.externalProps.concat(usedProps),
    internal: types.internalProps,
    links: types.links,
    receivedProps: types.externalProps.concat(usedProps).reduce((acc, x) => {
      if (props[x] !== undefined) {
        acc[x] = props[x];
      }
      return acc;
    }, {} as BaseProps)
  };

  return structure;
}
