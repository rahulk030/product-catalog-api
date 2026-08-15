import { Router } from "express";
import { validateProduct } from "../middleware/validateProduct.js";

export function createProductRouter(service) {
  const router = Router();

  router.get("/", asyncHandler(async (req, res) => {
    res.json(await service.list(req.query));
  }));

  router.get("/:id", asyncHandler(async (req, res) => {
    res.json(await service.getById(req.params.id));
  }));

  router.post("/", validateProduct(), asyncHandler(async (req, res) => {
    res.status(201).json(await service.create(req.body));
  }));

  router.patch("/:id", validateProduct({ partial: true }), asyncHandler(async (req, res) => {
    res.json(await service.update(req.params.id, req.body));
  }));

  router.delete("/:id", asyncHandler(async (req, res) => {
    await service.remove(req.params.id);
    res.status(204).end();
  }));

  return router;
}

function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}
