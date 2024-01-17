import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { serveStatic } from "@hono/node-server/serve-static";
import { filesRoute } from "#src/routes/files.route";
import { HomePage } from "#src/views/pages/home/home.page";
import { env } from "#src/data/env";
import { messages } from "#src/data/messages/en";

/// App init
export const app = new Hono();
app
  .use("*", prettyJSON())
  .notFound((c) => c.json({ message: messages.error.NOT_FOUND }, 404))
  .onError((err, c) => {
    console.error(err);
    return c.json({ message: messages.error.INTERNAL_SERVER_ERROR }, 500);
  });

/// Serve static files in the public folder
app.use("/public/*", serveStatic({ root: "./" }));

/// Home page route
app.get("/", (c) =>
  c.html(
    <HomePage.layout>
      <HomePage />
    </HomePage.layout>,
  ),
);

/// Main API init
const api = new OpenAPIHono({
  defaultHook: (result, c) => {
    if (!result.success) return c.json({ message: "Invalid request" }, 400);
  },
});
api.use("*", cors()).route("/files", filesRoute);
if (env.VERBOSE) {
  api.use("*", logger());
}

/// OpenAPI docs and Swagger UI
api.doc31("/openapi.json", {
  openapi: "3.1.0",
  info: { version: "1.0.0", title: "Simple File Storage API" },
});
api.get("/docs", swaggerUI({ url: "/api/v1/openapi.json" }));

/// Whole File Storage API type to be used in frontend projects
export type FileStorageApi = typeof api;

/// Mount the API
app.route("/api/v1", api);
