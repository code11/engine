import React from "react";
import ReactDOM from "react-dom";
import { ViewProvider } from "./context";
import {
  ProducerContext,
  RenderInstance,
  RenderConfig,
  RootElement,
  EngineModuleSource,
} from "@c11/engine.types";

export class Render implements RenderInstance {
  private context: ProducerContext;
  private config: RenderConfig;
  private root: RootElement = null;
  constructor(config: RenderConfig, context: ProducerContext) {
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
  container: any
): EngineModuleSource => {
  return {
    bootstrap: () => {},
    unmount: () => {},
    update: () => {},
    mount: (context: any) => {
      const config = {
        element,
        root: container,
      };
      const result = new Render(config, context);
      result.mount();
    },
  };
};
