import React from 'react';
import { BaseState, BaseProps, GenericState } from './types';

import { stateComponent } from './stateComponent';

// FEAT: Rollback mechanism

export function view(component: {
  args: GenericState;
  defaultProps?: GenericState;
  fn: React.FunctionComponent<BaseProps>;
}): React.ComponentClass<BaseProps, BaseState> {
  const db = window.db;
  const data = component.args;
  const fn = component.fn;
  const defaultProps = component.defaultProps;

  return stateComponent(db, data, fn, defaultProps);
  // This needs to be here to catch errors
}

// TODO: When creating the TS interface for a component include all the valid htmlAttributes on it

// TODO: Refactor
// TopLevel{
//   ErrorManagement,
//   propsManagement
// }

// MidLevel{
//   ChildSelection,
//   StateManagement,
//   ListenerManagement
// }

// LowLevel{
//   Rendering
// }
