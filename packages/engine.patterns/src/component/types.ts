type Timestamp = number;

export type Component = {
  id: string;
  createdAt: Timestamp;
  parentId: State["id"] | null;
  states: State["name"][];
  activeState: State["id"] | null;
  data: any;
  status: {
    isReady: boolean;
    isTransitioning: boolean;
  };
};

export type State<Data = { [k: string]: any }> = {
  id: string;
  name: string;
  createdAt: Timestamp;
  parentId: Component["id"];
  children: {
    [k: string]: Timestamp;
  };
  status: {
    isFrozen: boolean;
    isReady: boolean;
  };
  data: Data;
};
