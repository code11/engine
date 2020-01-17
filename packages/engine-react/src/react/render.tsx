import React from 'react';
import ReactDOM from 'react-dom'
import { ViewProvider } from './context';
import { ProducerContext, RenderInstance, RenderConfig  } from '@c11/engine-types';

export class Render implements RenderInstance {
  private context: ProducerContext;
  private config: RenderConfig;
  constructor(context: ProducerContext, config: RenderConfig) {
    this.config = config;
    this.context = context;
  }
  unmount() {
    return this;
  }
  mount() {
    const rootEl = document.querySelector(this.config.root)
    ReactDOM.render(
      <ViewProvider value={this.context}>{this.config.element}</ViewProvider>,
      rootEl
    );
    return this;
  }
}
