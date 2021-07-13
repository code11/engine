import { Unit } from "./unit";

export namespace Collection {
  // TODO: This is a hack, Props should be infered from CollectionItem
  type Props = {};
  export type Data<
    CollectionItem extends Unit.Entity<Props> | Unit.Item<Props>,
    Commands
  > = {
    byId: Record<CollectionItem["id"], CollectionItem>;
    count: number;
    ids: CollectionItem["id"][];
    actions: Commands;
  };
}
