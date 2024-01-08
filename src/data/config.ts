import process from "node:process";
import * as path from "node:path";

export const config = {
  STORAGE_PATH: path.join(process.cwd(), "storage"),
  DEFAULT_PAGE_SIZE: 5,
  MAX_PAGE_SIZE: 50,
};

export const DEV = process.env.NODE_ENV !== "production";
