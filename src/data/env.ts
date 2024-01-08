import * as process from "node:process";
import { z } from "zod";

const BoolSchema = z.enum(["true", "false"]).transform((v) => v === "true");

export const env = z
  .object({
    PORT: z.coerce.number().default(9009),
    FILEWATCHER_MODE: BoolSchema.default("false"),
    MAX_UPLOAD_SIZE: z.coerce.number().default(10 * 1024 * 1024),
    MAX_UPLOAD_COUNT: z.coerce.number().default(10),
    VERBOSE: BoolSchema.default("false"),
  })
  .parse({
    PORT: process.env.PORT,
    FILEWATCHER_MODE: process.env.FILEWATCHER_MODE,
    MAX_UPLOAD_SIZE: process.env.MAX_UPLOAD_SIZE,
    MAX_UPLOAD_COUNT: process.env.MAX_UPLOAD_COUNT,
    VERBOSE: process.env.VERBOSE,
  });
