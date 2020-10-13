const scripts = {
  build: require("./build"),
  clean: require("./clean"),
  serve: require("./serve"),
  start: require("./start"),
  test: require("./test"),
};

export = (name: string) => {
  scripts[name]();
};
