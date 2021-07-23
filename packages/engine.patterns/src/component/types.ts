type Timestamp = number;

export type Component<States = string[], Data = { [k: string]: any }> = {
  id: string;
  createdAt: Timestamp;
  parentId: Component["id"] | null;
  states: States;
  activeState: {
    name: string | null;
    id: Component["id"] | null;
  };
  data: Data;
  children: {
    [k: string]: Timestamp;
  };
  status: {
    isReady: boolean;
    isTransitioning: boolean;
    isFrozen: boolean;
  };
};
