import React from "react";
import { RenderContext } from "./render";

const ViewContext = React.createContext({} as RenderContext);

export const ViewProvider = ViewContext.Provider;
export const ViewConsumer = ViewContext.Consumer;
export default ViewContext;
