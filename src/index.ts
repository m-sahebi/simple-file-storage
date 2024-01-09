import process from "node:process";
import { serve } from "@hono/node-server";
import type { ServerType } from "@hono/node-server/dist/types";
import { app } from "#src/app";
import { env } from "#src/data/env";
import { $chalk } from "#src/lib/chalk";

function closeAppGracefully(srv: ServerType) {
  return (signal: NodeJS.Signals) => {
    console.log(`\n => Received signal to terminate: ${$chalk.warn(signal)}`);
    if (srv.listening)
      srv.close((err) => {
        console.log(
          err != null
            ? $chalk.error(`    Error while closing the server: ${err.message}`)
            : $chalk.success("    Server closed gracefully"),
        );
        process.exit(err == null ? 0 : 1);
      });
    else {
      console.log($chalk.muted("    Server already closed"));
      process.exit(0);
    }
  };
}

const server = serve({
  fetch: app.fetch,
  port: env.PORT,
}).on("listening", () => {
  console.log($chalk.success(`---------- Server is running on port ${env.PORT} ----------\n`));
});

process.on("SIGINT", closeAppGracefully(server));
process.on("SIGTERM", closeAppGracefully(server));
