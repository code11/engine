import ReactDOM from 'react-dom';
import React from 'react';
import db from 'jsonmvc-datastore';
import { DbProvider } from '../context';

export const engine = (config: any) => {
  const DB = db(config.initialState);
  const context = React.createContext({});
  const Provider = context.Provider;
  return {
    start: () => {
      config.producers.forEach((x: Function) => {
        x(DB);
      });
      ReactDOM.render(
        <DbProvider value={{ db: DB }}>{config.app}</DbProvider>,
        config.root
      );
    }
  };
};
