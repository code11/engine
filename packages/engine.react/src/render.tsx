import React from "react";
import ReactDOM from "react-dom";
import { ViewProvider } from "./context";
import {
  ProducerContext,
  RenderInstance,
  RenderConfig,
  RootElement,
  EngineModuleSource,
  ModuleContext,
} from "@c11/engine.types";

type ModuleConfig = {
  debug?: boolean;
};
export type RenderContext = { module: ModuleContext; config: ModuleConfig };

export class Render implements RenderInstance {
  private context: RenderContext;
  private config: RenderConfig;
  private root: RootElement = null;
  constructor(config: RenderConfig, context: RenderContext) {
    this.config = config;
    this.context = context;
  }
  private render(rootEl: HTMLElement) {
    this.root = rootEl;
    ReactDOM.render(
      <ViewProvider value={this.context}>{this.config.element}</ViewProvider>,
      rootEl
    );
  }
  getRoot() {
    return this.root;
  }
  unmount() {
    return this;
  }
  mount() {
    let rootEl;
    if (typeof this.config.root === "string") {
      rootEl = document.querySelector(this.config.root);
    } else if (this.config.root instanceof Function) {
      rootEl = this.config.root();
    } else {
      rootEl = this.config.root;
    }

    if (rootEl instanceof Promise) {
      rootEl.then((x) => {
        this.render(x);
      });
    } else {
      this.render(rootEl);
    }
    return this;
  }
}

export const renderReact = (
  element: any,
  container: any,
  config: ModuleConfig = {}
): EngineModuleSource => {
  return {
    bootstrap: () => {},
    unmount: () => {},
    update: () => {},
    mount: (moduleContext: ModuleContext) => {
      const renderConfig = {
        element,
        root: container,
      };
      const viewConfig = {
        debug: config.debug || false,
      };
      const renderContext = {
        module: moduleContext,
        config: viewConfig,
      };
      const result = new Render(renderConfig, renderContext);
      result.mount();
    },
  };
};
