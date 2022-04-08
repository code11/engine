import { ExternalProps } from "@c11/engine.types";

export class PassthroughGraph {
  private cb: Function;
  private destroyed = false;
  private props: ExternalProps;
  constructor(props: Object = {}, cb: Function = () => {}) {
    this.props = props;
    this.cb = cb;
  }
  private update() {
    if (this.destroyed) {
      return;
    }
    this.cb.call(null, this.props);
  }
  listen() {
    this.update();
  }
  destroy() {
    if (this.destroyed) {
      return;
    }
    this.destroyed = true;
  }
  updateExternal(props: ExternalProps = {}) {
    if (this.destroyed) {
      return;
    }
    this.props = props;
    this.update();
  }
}
