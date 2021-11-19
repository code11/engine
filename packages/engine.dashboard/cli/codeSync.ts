import express from "express";
import { join } from "path";
import cors from "cors";
import fs from "fs";

const app = express();
// TODO: this should be dynamic and passed by the service-web
// starting to coordinate with the app
const port = 3000;

app.use(cors());
app.get("/", (req, res) => {
  const filePath = req.query.file;
  if (!filePath || typeof filePath !== "string") {
    throw new Error("file path was not defined properly");
  }
  const data = fs.readFileSync(filePath, "utf-8");
  res.send(data);
});

app.get("/app-structure", (req, res) => {
  // TODO: this should be coordinated somehow with the babel-plugin-syntax
  // output - maybe read the package.json/engine settings file and get
  // the path from there
  const filePath = join(process.cwd(), ".app-structure.json");
  if (!filePath || typeof filePath !== "string") {
    throw new Error("file path was not defined properly");
  }
  const data = fs.readFileSync(filePath, "utf-8");
  res.send(data);
});

app.listen(port, () => {
  console.log("Waiting to sync files");
});
