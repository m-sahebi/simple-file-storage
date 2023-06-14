import { app } from "./app.js";
const port = 9000;

app.listen(port, () => {
  console.log(`Server Listening on Port http://localhost:${port}`);
});
