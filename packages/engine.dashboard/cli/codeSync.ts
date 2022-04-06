import express from "express";
import { join } from "path";
import cors from "cors";
import fs from "fs";
import WebSocket from "ws";

const dashboard = new WebSocket.Server({ port: 7071 });
const client = new WebSocket.Server({ port: 7072 });

let dashboardWs: any;
let clientWs: any;
let queue: string[] = [];

dashboard.on("connection", (ws) => {
  dashboardWs = ws;
  if (queue.length > 0) {
    queue.forEach((x) => dashboardWs.send(x));
  }
});

client.on("connection", (ws) => {
  clientWs = ws;
  ws.on("message", (message: string) => {
    if (dashboardWs) {
      dashboardWs.send(message);
    } else {
      queue.push(message);
    }
  });
});

const app = express();
// TODO: this should be dynamic and passed by the service-web
// starting to coordinate with the app
const port = 3000;

app.use(cors());
app.get("/", (req, res, next) => {
  const filePath = req.query.file;
  if (!filePath || typeof filePath !== "string") {
    throw new Error("file path was not defined properly");
  }
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      next(err);
      return;
    }
    res.send(data);
  });
});

app.get("/app-structure", (req, res, next) => {
  // TODO: this should be coordinated somehow with the babel-plugin-syntax
  // output - maybe read the package.json/engine settings file and get
  // the path from there
  const filePath = join(process.cwd(), ".app-structure.json");
  if (!filePath || typeof filePath !== "string") {
    throw new Error("file path was not defined properly");
  }
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      next(err);
      return;
    }
    res.send(data);
  });
});

app.listen(port, () => {
  console.log("Waiting to sync files");
});
