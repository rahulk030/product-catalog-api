import cors from "cors";
import express from "express";
import helmet from "helmet";
import { errorHandler, notFoundHandler } from "./middleware/errors.js";
import { ProductRepository } from "./repositories/productRepository.js";
import { createProductRouter } from "./routes/products.js";
import { ProductService } from "./services/productService.js";

export function createApp({ repository = new ProductRepository() } = {}) {
  const app = express();
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "100kb" }));

  app.get("/health", (_req, res) => res.json({ status: "ok" }));
  app.use("/api/products", createProductRouter(new ProductService(repository)));
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
