import React from 'react';
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
    this.config.render(
      <ViewProvider value={this.context}>{this.config.element}</ViewProvider>,
      this.config.root
    );
    return this;
  }
}
