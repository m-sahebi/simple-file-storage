import { z } from "@hono/zod-openapi";

export const FileResponseSchema = z
  .object({
    size: z.number(),
    type: z.string(),
    id: z.string(),
    name: z.string(),
    lastModified: z.number(),
  })
  .openapi({ description: "File Schema" });

export type FileResponse = z.infer<typeof FileResponseSchema>;
