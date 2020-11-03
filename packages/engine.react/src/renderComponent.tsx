import React from "react";
import { BaseState } from "./types";
// import { calculateExtraProps } from './calculateExtraProps';

export class RenderComponent extends React.Component<BaseState> {
  // componentDidCatch(error: Error, info: React.ErrorInfo) {
  //   console.log("Error error", error, info);
  // }
  // static getDerivedStateFromError(e: any) {
  //   console.log("error", e);
  // }
  render() {
    let el = this.props.fn.call(null, this.props.state.data);
    if (el) {
      let extraProps;
      // extraProps = calculateExtraProps(this.props, el);
      // TODO: if !extraProps just return the initial el without clonning
      return React.cloneElement(el as React.ReactElement, extraProps);
    } else {
      return null;
    }
  }
}
