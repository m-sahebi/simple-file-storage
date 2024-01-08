import path from "node:path";
import fs from "node:fs";
import { Hono } from "hono";
import { watch } from "chokidar";
import { config, DEV } from "#src/data/config";
import { fileExists, iteratorToStream, paginate, sanitizeFileName } from "#src/utils/helpers.util";
import { env } from "#src/data/env";
import { $chalk } from "#src/lib/chalk";
import { messages } from "#src/data/messages/en";
import { generateRandomId } from "#src/utils/primitive.util";

export type FileResponse = {
  size: number;
  type: string;
  id: string;
  name: string;
  lastModified: number;
};

export const fileListCache = new Set(
  env.FILEWATCHER_MODE ? [] : fs.readdirSync(config.STORAGE_PATH),
);
export function modifyFileListCache(filename: string, action: "add" | "delete") {
  if (env.FILEWATCHER_MODE) return;
  switch (action) {
    case "add":
      fileListCache.add(filename);
      break;
    case "delete":
      fileListCache.delete(filename);
      break;
    default:
      throw new Error(`Invalid action: ${String(action)}`);
  }
}

if (env.FILEWATCHER_MODE) {
  watch(config.STORAGE_PATH)
    .on("add", (p) => {
      if (env.VERBOSE) console.log($chalk.info("  + ADD", path.basename(p)));
      fileListCache.add(path.basename(p));
    })
    .on("unlink", (p) => {
      if (env.VERBOSE) console.log($chalk.info("  - DELETE", path.basename(p)));
      fileListCache.delete(path.basename(p));
    });
}

export const filesRoute = new Hono();

filesRoute.get("/", (c) => {
  const { limit, offset } = paginate(c.req.query());
  return c.json({ result: Array.from(fileListCache).slice(offset, offset + limit) });
});

filesRoute.get("/:id", async (c) => {
  const fileId = sanitizeFileName(c.req.param("id"));
  if (!fileId) {
    return c.json({ message: messages.error.INVALID_FILE_ID }, 400);
  }

  const filePath = path.join(config.STORAGE_PATH, fileId);

  c.res.headers.set("Content-Disposition", `inline; fileName="${fileId}"`);
  try {
    if (!(await fileExists(filePath)))
      return c.json({ message: messages.error.FILE_NOT_FOUND }, 404);

    // Sending the file at once
    // return c.newResponse(fs.readFileSync(filePath));

    // Sending the file with stream
    // TODO: it throws error in global scope if the file doesn't exist
    const stream = fs.createReadStream(filePath);
    return c.newResponse(iteratorToStream(stream.iterator()));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT")
      return c.json({ message: messages.error.FILE_NOT_FOUND }, 404);
    console.error(err);
    return c.json({ message: DEV ? String(err) : messages.error.SOMETHING_WENT_WRONG }, 500);
  }
});

filesRoute.post("/", async (c) => {
  const files = (await c.req.formData()).getAll("files");
  if (files.length === 0) {
    return c.json({ message: messages.error.NO_FILE }, 400);
  }
  if (files.length > env.MAX_UPLOAD_COUNT) {
    return c.json({ message: messages.error.TOO_MANY_FILES }, 400);
  }
  for (const f of files) {
    if (!(f instanceof File)) {
      return c.json({ message: messages.error.INVALID_FILE }, 400);
    } else if (f.size > env.MAX_UPLOAD_SIZE) {
      return c.json({ message: messages.error.FILE_TOO_LARGE }, 400);
    }
  }

  const fileList: FileResponse[] = [];

  for (const file of files) {
    const f = file as File;
    const randomId = generateRandomId();
    const fileName = sanitizeFileName(f.name) || randomId;
    const fileId = randomId + path.extname(fileName).trim().toLowerCase();
    const filePath = path.join(config.STORAGE_PATH, fileId);

    try {
      // eslint-disable-next-line no-await-in-loop -- Need to wait for every file to be written
      await fs.promises.writeFile(filePath, Buffer.from(await f.arrayBuffer()));
      modifyFileListCache(fileId, "add");
      fileList.push({
        size: f.size,
        type: f.type,
        id: fileId,
        name: fileName,
        lastModified: f.lastModified,
      });
    } catch (err) {
      console.error(err);
      return c.json({ message: DEV ? String(err) : messages.error.SOMETHING_WENT_WRONG }, 500);
    }
  }

  return c.json({ message: messages.success.FILES_UPLOADED, result: fileList });
});

filesRoute.delete("/:id", async (c) => {
  const fileId = sanitizeFileName(c.req.param("id"));
  const filePath = path.join(config.STORAGE_PATH, fileId);

  try {
    await fs.promises.unlink(filePath);
    modifyFileListCache(fileId, "delete");
    return c.json({ message: messages.success.FILE_DELETED }, 200);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return c.json({ message: messages.error.FILE_NOT_FOUND }, 404);
    }
    console.error(err);
    return c.json({ message: DEV ? String(err) : messages.error.SOMETHING_WENT_WRONG }, 500);
  }
});
