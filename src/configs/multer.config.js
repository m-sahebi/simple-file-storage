import fs from "fs";
import path from "path";
import multer from "multer";
import { customAlphabet } from "nanoid";
import { MAX_FILE_SIZE } from "./app.config.js";

const generateId = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  20,
);

//Multer that handle File Uploads
export const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const folderName = req.query.folderName;
      const path = folderName ? `storage/${folderName}/` : "storage/";
      fs.mkdirSync(path, { recursive: true });
      cb(null, path);
    },
    filename: function (req, file, cb) {
      cb(null, generateId() + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: function (req, file, cb) {
    cb(null, true);
  },
});
