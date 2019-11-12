export interface GenericState {
  [key: string]: any;
}

export interface BaseState {
  [key: string]: any;
  hasError?: boolean;
  errorMessage?: string;
}

export interface BaseData {
  [key: string]: any;
}

export interface BaseProps {
  [key: string]: any;
}

export type DynamicDataPath = (
  data: { [key: string]: string },
  props: { [key: string]: string }
) => string;

export interface DataPathStructure {
  name: string;
  vars?: string[];
  path: string | DynamicDataPath;
}
