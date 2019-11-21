import React from 'react';

const DbContext = React.createContext({});

export const DbProvider = DbContext.Provider;
export const DbConsumer = DbContext.Consumer;
export default DbContext;
