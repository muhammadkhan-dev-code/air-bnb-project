import { readEnv } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import { createApp } from "./app.js";
try {
  const config = readEnv();
  await connectDatabase(config.mongoUrl);
  const store = MongoStore.create({
    mongoUrl: config.mongoUrl,
    collectionName: "sessions",
  });
  store.on("error", () => console.error("Session store connection failed."));
  const app = createApp({ ...config, store });
  const server = app.listen(config.port, () =>
    console.log(`API ready at http://localhost:${config.port}`),
  );
  for (const signal of ["SIGTERM", "SIGINT"])
    process.once(signal, () => {
      server.close(async () => {
        await store.close();
        await mongoose.disconnect();
        process.exit(0);
      });
      setTimeout(() => process.exit(1), 10000).unref();
    });
} catch (error) {
  console.error(`Startup failed: ${error.message}`);
  process.exit(1);
}
