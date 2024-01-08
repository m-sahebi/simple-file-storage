import "dotenv/config";
import { app } from "#src/app.js";
import { PORT } from "./configs/app.config.js";
import { logConfigs } from "./utils/helpers.js";

const server = app.listen(PORT, () => {
  logConfigs();
  console.log(`Server running at http://localhost:${PORT}`);
});

async function closeGracefully(signal) {
  console.log(`=> Received signal to terminate: ${signal}`);
  await server.close(async (err) => {
    console.log(err ? `Error while closing the server: ${err}` : "Server closed gracefully");
    process.kill(process.pid, signal);
  });
}

process.once("SIGINT", closeGracefully);
process.once("SIGTERM", closeGracefully);
