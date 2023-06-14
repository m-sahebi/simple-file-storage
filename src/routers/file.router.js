import { Router } from "express";
import fs from "fs";
import path from "path";
import { upload } from "../configs/multer.config.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Upload file
router.post("/upload", authMiddleware, upload.single("myFile"), async (req, res) => {
  console.log(req.file);
  if (req.file) {
    res.json({
      filename: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
    });
  }
});

// This will delete a file
router.delete("/f/:filename", async (req, res) => {
  const { filename } = req.params;
  if (!filename) {
    return res.status(400).json({ message: "Invalid filename" });
  }

  const folderpath = `bucket/${fileName}`;

  fs.unlink(folderpath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).end();
    }
    return res.json({ message: "File deleted successfully" });
  });
  return res.json({ message: "File deleted successfully" });
});

export { router as fileRouter };

//get a file (no need cuz we have static file server in express)
// router.get("/f/:filename", (req, res) => {
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
router.get("/f", authMiddleware, async (req, res) => {
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
