import React from 'react';

const EngineContext = React.createContext({});

export const EngineProvider = EngineContext.Provider;
export const EngineConsumer = EngineContext.Consumer;
export default EngineContext;
