import "dotenv/config";
import { app } from "./app.js";
import cluster from "cluster";
import { PORT } from "./configs/app.config.js";
import { logConfigs } from "./utils/helpers.js";

if (cluster.isMaster) {
  cluster.fork();

  cluster.on("exit", function () {
    cluster.fork();
  });
}

if (cluster.isWorker) {
  app.listen(PORT, () => {
    logConfigs();
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
