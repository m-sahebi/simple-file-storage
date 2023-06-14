import fs from "fs";
import path from "path";
import multer from "multer";
import { customAlphabet } from "nanoid";

const generateId = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  20,
);

//Multer that handle File Uploads
export const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const folderName = req.query.folderName;
      console.log(req.query);
      const path = folderName ? `bucket/${folderName}/` : "bucket/";
      fs.mkdirSync(path, { recursive: true });
      cb(null, path);
    },
    filename: function (req, file, cb) {
      cb(null, generateId() + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 5000_000 },
  fileFilter: function (req, file, cb) {
    cb(null, true);
  },
});
