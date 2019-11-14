import React from 'react';
import { BaseProps, BaseState } from './types';

/**
 * - Receives props from the outside world.
 * - Creates the state manager (which to be a component
 * to properly handle errors).
 * - Looks over errors that might occur in the state manager
 * and handles them accordingly
 */
export default function propsComponent() {
  return class PropsComponent extends React.Component<BaseProps, BaseState> {};
}
