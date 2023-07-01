import fs from "fs";
import path from "path";
import multer from "multer";
import { MAX_FILE_SIZE } from "./app.config.js";
import { generateId } from "../utils/helpers.js";

//Multer handle File Uploads
export const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const path = "storage/";
      fs.mkdirSync(path, { recursive: true });
      cb(null, path);
    },
    filename: function (req, file, cb) {
      cb(null, generateId() + path.extname(file.originalname).trim().toLowerCase());
    },
  }),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: function (req, file, cb) {
    cb(null, true);
  },
});
