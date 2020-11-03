import React from "react";

const ViewContext = React.createContext({});

export const ViewProvider = ViewContext.Provider;
export const ViewConsumer = ViewContext.Consumer;
export default ViewContext;
