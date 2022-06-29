const bcrypt = require("bcrypt");
// .env
require("dotenv").config();

// Express
const express = require("express");
const app = express(); // express app
app.set("view engine", "ejs"); // view engine

// Mongoose
const mongoose = require("mongoose");
mongoose
  .connect(process.env.DB_URL) // try connecting to db
  .then(() => console.log("*** MONGOOSE: CONNECTED TO DB"))
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

app.post("/upload", upload.single("file"), async (req, res) => {
  // map submited file data
  const pwd = req.body.password;
  const fileData = {
    path: req.file.path,
    originalName: req.file.originalname,
  };
  // add hashed pwd if pwd exists
  if (pwd != null && pwd !== "") fileData.password = await bcrypt.hash(pwd, 10);

  await File.create(fileData);

  res.sendStatus(200);
});

app.listen(process.env.PORT);
