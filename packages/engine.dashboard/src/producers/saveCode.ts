import axios from "axios";

export const saveCode: producer = ({
  trigger = observe.saveCode,
  getElement = get.structure.elements[arg.trigger.id],
  getLinkElement = get.structure.elements[param.id],
  updateCode = update.structure.code[arg.trigger.id],
  updateLinkElementStart = update.structure.elements[param.id].meta.location
    .start.line,
  updateLinkElementEnd = update.structure.elements[param.id].meta.location.end
    .line,
  files = get.structure.fileCode,
  updateFile = update.structure.fileCode,
  raw = get.structure.raw,
}) => {
  if (!trigger) {
    return;
  }

  //TODO: all code handling should be done through AST

  const element = getElement.value();
  const elementCode = trigger.code;

  updateCode.set(elementCode);

  const filePath = element.meta.absoluteFilePath;
  const fileCode = files.value()[filePath];
  const fileLines = fileCode.split("\n");
  const elementLines = elementCode.split("\n");
  const fileElementLines = fileLines.slice(
    element.meta.location.start.line - 1,
    element.meta.location.end.line - 1
  );
  const startIdx = fileElementLines.reduce((acc, x, idx) => {
    if (x.includes("=>")) {
      acc = idx;
    }
    return acc;
  }, -1);
  const beginBody = startIdx + element.meta.location.start.line;
  const linesToBeRemoved = element.meta.location.end.line - beginBody;
  fileLines.splice(beginBody, linesToBeRemoved - 1);
  for (let i = 0; i < elementLines.length; i += 1) {
    fileLines.splice(beginBody, 0, elementLines[elementLines.length - i - 1]);
  }
  const finalCode = fileLines.join("\n");
  updateFile.merge({
    [filePath]: finalCode,
  });

  // save the file;
  axios
    .post(`http://localhost:3000`, {
      filePath,
      body: finalCode,
    })
    .then((x) => {
      console.log("response", x);
    });

  const lineDiff = elementLines.length + 1 - linesToBeRemoved;
  if (lineDiff === 0) {
    return;
  }

  updateLinkElementEnd.set(element.meta.location.end.line + lineDiff, {
    id: trigger.id,
  });

  const links = Object.keys(raw.value()[filePath])
    .filter((x) => x !== trigger.id)
    .map((x) => getLinkElement.value({ id: x }));

  links.forEach((x) => {
    if (x.meta.location.start.line > element.meta.location.start.line) {
      console.log(lineDiff);
      updateLinkElementStart.set(x.meta.location.start.line + lineDiff, {
        id: x.buildId,
      });
      updateLinkElementEnd.set(x.meta.location.end.line + lineDiff, {
        id: x.buildId,
      });
    }
  });
};
