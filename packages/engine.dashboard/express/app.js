const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const port = 3000;

app.use(cors());
app.get("/", (req, res) => {
  const filePath = req.query.file;
  const data = fs.readFileSync(filePath, "utf-8");
  res.send(data);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
