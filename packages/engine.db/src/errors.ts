export default {
  patch: {
    "1": { text: "Invalid arguments given.", name: "patch" },
    "2": {
      text: "Tried to apply patch but failed and rolled back.",
      name: "patch",
    },
    "3": { text: "Patch is not a valid json.", name: "patch" },
  },
  on: {
    "1": { text: "Invalid arguments given", name: "on" },
    "2": { text: "A listener function threw an error", name: "on" },
  },
  db: {
    "1": { text: "Data must be an object literal.", name: "db" },
    "2": {
      text: "Data shouldn't contain protected (add list of) properties.",
      name: "db",
    },
  },
  node: {
    "1": { text: "Node already exists at the given path.", name: "node" },
    "2": { text: "Invalid node arguments given.", name: "node" },
    "3": { text: "Nodes can't be cyclical.", name: "node" },
    "4": {
      text: "The node function need to have the same number of arguments as the dependencies.",
      name: "node",
    },
    "5": { text: "Node was called and an error was raised", name: "node" },
  },
};
