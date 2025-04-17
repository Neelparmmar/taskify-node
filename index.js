const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));
app.get("/", function (req, res) {
  fs.readdir("./Files", (err, files) => {
    res.render("index", { files: files });
  });
});
app.post("/create", (req, res) => {
  fs.writeFile(
    `./Files/${req.body.title.split(" ").join("")}.txt`,
    req.body.details,
    (err) => {
      if (err) return console.log(err);
      console.log("done");
      res.redirect("/");
    }
  );
});
app.get("/file/:name", (req, res) => {
  fs.readFile(`./Files/${req.params.name}`, (err, data) => {
    if (err) {
      res.send("error :" + err);
    }
    res.render("Home", { data: data, filename: req.params.name });
  });
  // res.send(`file name is ${req.params.name}`)
});
app.get("/delete/:filename", (req, res) => {
  fs.unlink(`./Files/${req.params.filename}`, (err) => {
    if (err) {
      res.send("error", err);
    }
    res.redirect("/");
  });
});
app.get("/edit/:filename", (req, res) => {
  res.render("Edit", { filename: req.params.filename });
});
app.post("/edit", (req, res) => {
  const prevTitle = req.body.prevtitle;
  let newTitle = req.body.newtitle;
  if (!path.extname(newTitle)) {
    newTitle += ".txt";
  }
  fs.rename(`./Files/${prevTitle}`, `./Files/${newTitle}`, (err) => {
    if (err) {
      console.error("Rename error:", err);
      return res.status(500).send("Something went wrong while renaming.");
    }
    res.redirect("/");
  });
});
app.listen(3000, () => {
  console.log("Running...");
});
