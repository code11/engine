import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
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

app.listen(port, () => {
  console.log("Waiting to sync files");
});
