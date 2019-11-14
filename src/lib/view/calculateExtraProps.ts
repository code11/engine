import kebabCase from 'kebab-case';

export function calculateExtraProps(props: any, el: any) {
  const rProps = props.rProps;
  const propsStructure = props.propsStructure;

  const receivedProps = Object.keys(rProps).reduce(
    (acc, x) => {
      if (/^data\-/.test(x)) {
        acc.data[x] = rProps[x];
      } else if (/^aria\-/.test(x)) {
        acc.aria[x] = rProps[x];
      } else if (/^role/.test(x)) {
        acc.role = rProps[x];
      } else if (/^className/.test(x)) {
        acc.className = rProps[x];
      } else {
        if (propsStructure.external.includes(x)) {
          acc.props[x] = rProps[x];
        }
      }
      return acc;
    },
    {
      className: undefined,
      data: {},
      props: {},
      aria: {},
      role: undefined
    } as any
  );
  let extraProps = Object.keys(receivedProps.props).reduce((acc, x) => {
    acc[`data-props-${kebabCase(x)}`] = receivedProps.props[x];
    return acc;
  }, Object.assign({}, receivedProps.data));

  extraProps = Object.keys(props.state).reduce((acc, x) => {
    const name = `data-values-${kebabCase(x)}`;
    acc[name] = props.state[x];
    return acc;
  }, extraProps);

  if (receivedProps.className) {
    extraProps.className = receivedProps.className;
    if (el.props.className) {
      // TODO: Dedupe class names
      extraProps.className += ' ' + el.props.className;
    }
  }

  extraProps = Object.assign(extraProps, receivedProps.aria);

  if (receivedProps.role) {
    extraProps['role'] = receivedProps.role;
  }

  return extraProps;
}
