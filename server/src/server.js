import app from "./app.js";
import { env } from "./config/env.js";

app.listen(env.port, () => {
  console.log(`Akili API démarrée sur http://localhost:${env.port}`);
});
