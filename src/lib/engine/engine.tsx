import React from 'react';
import ReactDOM from 'react-dom';
import db from 'jsonmvc-datastore';
import { EngineProvider } from './context';
import { EngineConfig } from './';
import { ProducerInstance } from '../index';
import { ProducerContext } from '../producer';

export class Engine {
  initialized = false;
  config: EngineConfig;
  producers: ProducerInstance[] = [];
  view: Element | null = null;
  context: ProducerContext | null = null;
  constructor(config: EngineConfig) {
    this.config = config;
  }

  private init() {
    this.initialized = true;
    this.context = {
      db: db(this.config.state.default)
    };
    if (this.config.producers) {
      this.producers = this.config.producers.map(x => {
        return x();
      });
    }
    if (this.config.view) {
      this.view = ReactDOM.render(
        <EngineProvider value={context}>{config.view}</EngineProvider>,
        config.root
      );
    }
  }

  private resume() {}

  start() {
    if (!this.initialized) {
      this.init();
    } else {
      this.resume();
    }
  }
  stop() {}
  update() {
    // for views ReactDOM.unmountComponentAtNode(container)
  }
}

export const engine = (config: EngineConfig): EngineApi => {
  const DB = db(config.initialState);
  const context = {
    db: DB
  };
  let producers;
  let view;
  producers;
  view;
  return {
    start: () => {},
    update: () => {},
    /**
     * Will halt all execution.
     * This could be resumed from start.
     */
    stop: () => {
      throw new Error('Not implemented');
    }
  };
};
