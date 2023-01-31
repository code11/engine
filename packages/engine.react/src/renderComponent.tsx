import React, { useEffect } from "react";
import { BaseState } from "./types";
// import { calculateExtraProps } from './calculateExtraProps';

export const RenderComponent = ({
  fn,
  viewId,
  state,
  onMount,
  ...other
}: any) => {
  let extraProps = {
    "data-viewid": viewId,
    //TODO: add view name/location for debugging
  };
  useEffect(() => {
    onMount();
  });
  let el = fn.call(null, state.data);
  if (el) {
    return React.cloneElement(el, extraProps);
  } else {
    return null;
  }
};
