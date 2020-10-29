const scripts = {
  build: require("./build"),
  clean: require("./clean"),
  start: require("./start")
};

export = (name: string) => {
  scripts[name]();
};
