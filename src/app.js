import express from "express";
import bodyParser from "body-parser";
import { fileRouter } from "./routers/file.router.js";
import path from "path";
import cors from "cors";

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", path.join("./src", "views"));

app.use("/f", fileRouter);
app.use("/f", express.static(`./storage`, { fallthrough: false }));

app.get("/", (req, res, next) => {
  res.status(200).render("index");
});

app.use((req, res) => {
  return res.status(404).json({ message: "Not found!" });
});

app.use((err, req, res, next) => {
  if (!err || err.statusCode === 404) return res.status(404).json({ message: "Not found!" });
  res.status(500).json({ message: "Something went wrong!" });
  console.error(err);
});

export { app };
