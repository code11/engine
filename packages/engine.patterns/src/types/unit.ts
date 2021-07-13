import { Data } from "./data";

export namespace Unit {
  type Props = {};

  type EntityBase = {
    id: Data.Id;
    uid: Data.Uid;
  };

  export type Entity<EntityProps extends Props> = EntityBase &
    {
      [Prop in keyof EntityProps]: EntityProps[Prop];
    };

  type ItemBase = {
    id: Data.Id;
  };

  export type Item<ItemProps extends Props> = ItemBase &
    {
      [Prop in keyof ItemProps]: ItemProps[Prop];
    };

  export type Element = unknown;
  export type Component = unknown;
}
