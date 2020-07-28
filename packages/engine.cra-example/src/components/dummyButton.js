import React from "react";
// import { view } from "@c11/engine.macro";
import { Set, Prop } from "../state";

export const DummyButton = (
  setProp = Set["@path"],
  bam = Prop["@foo"],
  children = Prop["@children"]
) => (
  <button onClick={() => setProp(Date.now())}>
    Children are {bam} - {children}
  </button>
);
