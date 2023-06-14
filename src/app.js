import express from "express";
import bodyParser from "body-parser";
import { fileRouter } from "./routers/file.router.js";
import path from "path";

const app = express();

app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", path.join("./src", "views"));
app.use("/f", express.static(`./bucket`));

app.use("/", fileRouter);

app.use("/", (req, res) => {
  res.status(200).render("index");
});

export { app };
