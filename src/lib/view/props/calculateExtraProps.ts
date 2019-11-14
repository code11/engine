import kebabCase from 'kebab-case';

export function calculateExtraProps(props: any, el: any) {
  let extraProps = Object.keys(props.receivedProps.props).reduce((acc, x) => {
    acc[`data-props-${kebabCase(x)}`] = props.receivedProps.props[x];
    return acc;
  }, Object.assign({}, props.receivedProps.data));

  extraProps = Object.keys(props.state).reduce((acc, x) => {
    const name = `data-values-${kebabCase(x)}`;
    acc[name] = props.state[x];
    return acc;
  }, extraProps);

  if (props.receivedProps.className) {
    extraProps.className = props.receivedProps.className;
    if (el.props.className) {
      // TODO: Dedupe class names
      extraProps.className += ' ' + el.props.className;
    }
  }

  extraProps = Object.assign(extraProps, props.receivedProps.aria);

  if (props.receivedProps.role) {
    extraProps['role'] = props.receivedProps.role;
  }
  return extraProps;
}
