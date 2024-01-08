import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { filesRoute } from "#src/routes/files.route";
import { HomePage } from "#src/views/pages/home/home.page";
import { env } from "#src/data/env";
import { messages } from "#src/data/messages/en";

export const app = new Hono();
app.use("*", prettyJSON());
app.notFound((c) => c.json({ message: messages.error.NOT_FOUND }, 404));
app.onError((err, c) => {
  console.error(err);
  return c.json({ message: messages.error.INTERNAL_SERVER_ERROR }, 500);
});

app.get("/", (c) =>
  c.html(
    <HomePage.layout>
      <HomePage />
    </HomePage.layout>,
  ),
);

const api = new Hono();
if (env.VERBOSE) {
  api.use("*", logger());
}
api.use("*", cors());
api.route("/files", filesRoute);

app.route("/api", api);
