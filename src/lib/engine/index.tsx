import ReactDOM from 'react-dom';
import React from 'react';
import db from 'jsonmvc-datastore';
import { DbProvider } from '../context';

export const engine = (config: any) => {
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
