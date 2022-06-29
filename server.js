const bcrypt = require("bcrypt");
// .env
require("dotenv").config();

// Express
const express = require("express");
const app = express(); // express app
app.set("view engine", "ejs"); // view engine
app.use(express.urlencoded({ extended: true }));

// Mongoose
const mongoose = require("mongoose");
mongoose
  .connect(process.env.DB_URL) // try connecting to db
  .then(() =>
    console.log(`*** MONGOOSE: CONNECTED TO DB ON PORT: ${process.env.PORT}`)
  )
  .catch((ex) => console.log("*** MONGOOSE: ERROR", ex));

// Models
const File = require("./models/Files");

// Multer
const multer = require("multer");
const upload = multer({ dest: "uploads" }); // upload middleware

// *Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/file/:id", handleDownload);
app.post("/file/:id", handleDownload);

app.post("/upload", upload.single("file"), async (req, res) => {
  // **TODO: trycatch block
  const pwd = req.body.password;

  const fileData = {
    path: req.file.path,
    originalName: req.file.originalname,
  };

  if (pwd != null && pwd !== "") fileData.password = await bcrypt.hash(pwd, 10);

  const savedFile = await File.create(fileData); // save file to db

  res.render("index", {
    fileLink: `${req.headers.origin}/file/${savedFile._id}`,
  });
});

// handle download middleware
async function handleDownload(req, res) {
  const file = await File.findById(req.params.id);

  if (file.password != null) {
    if (req.body.password == null) {
      res.render("password");
      return;
    }

    if (!(await bcrypt.compare(req.body.password, file.password))) {
      res.render("password", { error: true });
      return;
    }
  }

  file.downloadCount++;
  await file.save();

  res.download(file.path, file.originalName);
}

// Spin up the server
app.listen(process.env.PORT);
