import React, { ComponentClass, ReactElement } from 'react';
import ReactDOM from 'react-dom';
import { ViewProvider } from './context';
import { ProducerContext } from '../../producer';
import { RenderInstance } from '..';

export class Render implements RenderInstance {
  constructor(
    private context: ProducerContext,
    private element: ReactElement,
    private root: Element
  ) {}
  unmount() {
    return this;
  }
  mount() {
    ReactDOM.render(
      <ViewProvider value={this.context}>{this.element}</ViewProvider>,
      this.root
    );
    return this;
  }
}
