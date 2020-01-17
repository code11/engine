import React from "react";
import { view, producer } from "@c11/engine.macro";
import { Get, Set, Prop } from "../state";

export const DummyButton = view(
  (
    setProp = Set["@path"],
    bam = Prop["@foo"],
    children = Prop["@children"]
  ) => (
    <button onClick={() => setProp(Date.now())}>
      Children are {bam} - {children}
    </button>
  )
);
