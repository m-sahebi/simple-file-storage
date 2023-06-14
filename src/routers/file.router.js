import { Router } from "express";
import fs from "fs";
import path from "path";
import { upload } from "../configs/multer.config.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Upload file
const multerMw = upload.single("myFile");
router.post("/upload", authMiddleware, multerMw, async (req, res) => {
  console.log(req.file);
  if (req.file) {
    return res.json({
      filename: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
    });
  }
  return res.status(400).end();
});

// This will delete a file
router.delete("/:filename", async (req, res) => {
  const { filename } = req.params;
  if (!filename) {
    return res.status(400).json({ message: "Invalid filename" });
  }

  const path = `bucket/${filename}`;

  if (!fs.existsSync(path)) {
    return res.status(404).json({ message: "Not found" });
  }

  fs.unlink(path, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).end();
    }
    return res.json({ message: "File deleted successfully" });
  });
});

//get a file (no need cuz we have static file server in express)
// router.get("/:filename", (req, res) => {
//   const { filename } = req.params;
//   if (!filename) {
//     return res.status(400).json({ message: "Invalid filename" });
//   }
//
//   const filePath = `bucket/${filename}`;
//
//   if (!fs.existsSync(filePath)) {
//     return res.status(404).json({ message: "Not found" });
//   }
//   res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
//   const fileStream = fs.createReadStream(filePath);
//
//   fileStream.pipe(res);
// });

// get list of all files
router.get("/", authMiddleware, async (req, res) => {
  const directoryPath = "bucket";
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).json({
        message: "Something went wrong",
      });
    }

    const allfiles = files.filter((file) => {
      const filePath = path.join(directoryPath, file);
      return fs.statSync(filePath).isFile();
    });

    return res.json({ items: allfiles });
  });
});

export { router as fileRouter };
