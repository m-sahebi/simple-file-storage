import fs from "node:fs";
import path from "node:path";
import sanitize from "sanitize-filename";
import { config } from "#src/data/config";
import { clamp } from "#src/utils/primitive.util";

export function iteratorToStream<T>(iterator: AsyncIterableIterator<T>) {
  return new ReadableStream({
    async pull(controller) {
      const r = await iterator.next();

      if (r.done) {
        controller.close();
      } else {
        controller.enqueue(r.value);
      }
    },
  });
}

export function paginate(
  params: {
    offset?: number | null;
    limit?: number | null;
    page?: number | null;
    pageSize?: number | null;
  },
  total?: number,
) {
  const { offset, limit, page, pageSize } = params;
  const take = clamp(pageSize ?? limit ?? config.DEFAULT_PAGE_SIZE, 1, config.MAX_PAGE_SIZE);
  const skip = clamp(page != null ? (page - 1) * take : offset ?? 0, 0, total);

  return {
    limit: take,
    offset: skip,
  } as const;
}

export async function fileExists(filePath: string) {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function sanitizeFileName(fileName: string) {
  const { name, ext: extRaw } = path.parse(sanitize(fileName));
  const extNoDot = extRaw.slice(1).trim().toLowerCase();
  const ext = extNoDot && `.${extNoDot}`;
  return name.trim() + ext;
}
