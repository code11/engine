import ReactDOM from 'react-dom';
import React, { DOMElement } from 'react';
import db from 'jsonmvc-datastore';
import { DbProvider } from '../context';

export interface EngineConfig {
  producers: any[],
  view: JSX.Element,
  initialState: {
    [key: string]: string
  },
  root: Element | HTMLDivElement,
  utils: {
    [key: string]: Function
  }
}

export const engine = (config: EngineConfig) => {
  const DB = db(config.initialState);
  return {
    start: () => {
      (config.producers || []).forEach((x: Function) => {
        x(DB);
      });
      ReactDOM.render(
        <DbProvider value={{db: DB}}>{config.view}</DbProvider>,
        config.root
      );
    }
  };
};
