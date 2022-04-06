import axios from "axios";
export const getCode: producer = ({
  selectedElement = observe.selectedElement.id,
  getAbsPath = get.structure.elements[arg.selectedElement].meta
    .absoluteFilePath,

  getLocation = get.structure.elements[arg.selectedElement].meta.location,
  updateCode = update.structure.code[arg.selectedElement],
  getCode = get.structure.elements[arg.selectedElement].code,
}) => {
  if (!selectedElement || getCode.value()) {
    return;
  }

  axios
    .get(`http://localhost:3000?file=${getAbsPath.value()}`)
    .then((x) => {
      const code = x.data;
      const location = getLocation.value();
      const lines = code.split("\n");
      const elementLines = lines.slice(
        location.start.line - 1,
        location.end.line - 1
      );
      const body = elementLines.reduce(
        (acc, x) => {
          if (acc.found && x !== "") {
            acc.body += `${x}\n`;
          }
          if (x.includes("=>")) {
            acc.found = true;
          }
          return acc;
        },
        { found: false, body: "" }
      );
      updateCode.set(body.body);
    })
    .catch((e) => {
      console.error(e);
    });
};
