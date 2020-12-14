export const getStaticProps = (references: string[] = [], props: any) => {
  if (!props) {
    return;
  }

  const result = Object.keys(props).reduce((acc, x) => {
    let external = `external.${x}`;
    if (references.includes(external)) {
      acc[x] = true;
    } else {
      acc[x] = props[x];
    }
    return acc;
  }, {} as { [k: string]: any });

  return result;
};
