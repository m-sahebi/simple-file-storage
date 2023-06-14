import { app } from "./app.js";

const port = 9000;

import cluster from "cluster";
if (cluster.isMaster) {
  cluster.fork();

  cluster.on("exit", function (worker, code, signal) {
    cluster.fork();
  });
}

if (cluster.isWorker) {
  app.listen(port, () => {
    console.log(`Server Listening on Port http://localhost:${port}`);
  });
}
