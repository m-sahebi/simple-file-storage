import { serve } from "@hono/node-server";
import type { ServerType } from "@hono/node-server/dist/types";
import { app } from "#src/app";
import { env } from "#src/data/env";
import { $chalk } from "#src/lib/chalk";

function closeAppGracefully(srv: ServerType) {
  return (signal: NodeJS.Signals) => {
    console.log(`=> Received signal to terminate: ${signal}`);
    srv.close((err) => {
      console.log(
        err != null ? `Error while closing the server: ${err.message}` : "Server closed gracefully",
      );
      process.kill(process.pid, signal);
    });
  };
}

const server = serve({
  fetch: app.fetch,
  port: env.PORT,
}).on("listening", () => {
  console.log($chalk.success(`---------- Server is running on port ${env.PORT} ----------\n`));
});

process.once("SIGINT", closeAppGracefully(server));
process.once("SIGTERM", closeAppGracefully(server));
