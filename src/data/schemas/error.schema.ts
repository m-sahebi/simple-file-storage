import { z } from "@hono/zod-openapi";

export const ErrorResponseSchema = z
  .object({
    code: z.number().optional().openapi({ example: 1001 }),
    message: z.string().openapi({ example: "Error message" }),
  })
  .openapi({ description: "Error Schema" });

export const Error400Response = {
  content: { "application/json": { schema: ErrorResponseSchema } },
  description: "Bad request",
};

export const Error404Response = {
  content: { "application/json": { schema: ErrorResponseSchema } },
  description: "File not found",
};

export const Error500Response = {
  content: { "application/json": { schema: ErrorResponseSchema } },
  description: "Internal server error",
};
