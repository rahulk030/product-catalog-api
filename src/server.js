import "dotenv/config";
import { createApp } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";

const port = Number(process.env.PORT ?? 3000);
const mongoUri = process.env.MONGODB_URI ?? "mongodb://localhost:27017/product_catalog";

await connectDatabase(mongoUri);
const server = createApp().listen(port, () => {
  console.log(`Product Catalog API listening on http://localhost:${port}`);
});

async function shutdown(signal) {
  console.log(`${signal} received, closing server`);
  server.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
