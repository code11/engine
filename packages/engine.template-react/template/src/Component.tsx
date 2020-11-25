type external = {
  name: string;
};

type props = {
  item: State["item"]["a"];
};

export const Component: view<external> = ({
  item = observe.item[prop.name],
}: props) => {
  return <div>{item}</div>;
};
