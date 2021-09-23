import { PathSymbol } from "./symbol";

export const isPath = (path: any) => path && path.__symbol__ === PathSymbol;
