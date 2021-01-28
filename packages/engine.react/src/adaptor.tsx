import React from "react";
import { engine } from "@c11/engine.runtime";
import { EngineConfig } from "@c11/engine.types";
import { ModuleConfig, render } from "./render";

type ComponentProps = {
  [k: string]: any;
};

export const adaptor = (
  Component: any,
  opts: ModuleConfig = { debug: false },
  engineConfig: EngineConfig = {}
): React.ComponentClass => {
  return class AdaptorComponent extends React.Component<ComponentProps> {
    app: any;
    provideMountPoint: any;
    mountRef: any;
    updatePropsCb: any;
    lastProps: any;
    constructor(props: ComponentProps) {
      super(props);
      this.mountRef = React.createRef();
      opts.updateProps = (cb) => {
        this.updatePropsCb = cb;
        if (this.lastProps) {
          cb(this.lastProps);
        }
      };
      const renderModule = render(<Component />, this.mountPoint(), opts);
      if (engineConfig.use) {
        engineConfig.use.push(renderModule);
      } else {
        engineConfig.use = [renderModule];
      }
      this.app = engine(engineConfig);
    }
    mountPoint() {
      let resolve: (value: unknown) => void;
      this.provideMountPoint = () => {
        if (resolve) {
          resolve(this.mountRef.current);
        }
      };
      return new Promise((r) => {
        resolve = r;
      });
    }
    syncProps(props: any) {
      if (this.updatePropsCb) {
        this.updatePropsCb(props);
      } else {
        this.lastProps = props;
      }
    }
    componentDidMount() {
      this.provideMountPoint();
      this.app.start();
    }
    componentWillUnmount() {
      this.app.stop();
    }
    render() {
      this.syncProps(this.props);
      return <div ref={this.mountRef}>mount here</div>;
    }
  };
};
