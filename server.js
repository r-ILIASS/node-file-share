// Multer
const multer = require("multer");
// Express
const express = require("express");
const app = express();

// Multer middleware
const upload = multer({ dest: "uploads" });

// Setting the view engine
app.set("view engine", "ejs");

// Routes HEAD
// Home
app.get("/", (req, res) => {
  res.render("index");
});
// /upload POST
// Run upload middlware first
app.post("/upload", upload.single("file"), (req, res) => {
  res.send("File submitted");
});
// Route TAIL

app.listen(4000);
