export function notFoundHandler(req, _res, next) {
  next(Object.assign(new Error(`Route ${req.method} ${req.originalUrl} not found`), { status: 404 }));
}

export function errorHandler(error, _req, res, _next) {
  if (error.name === "CastError") error = Object.assign(new Error("Invalid resource id"), { status: 400 });
  if (error.code === 11000) error = Object.assign(new Error("SKU is already in use"), { status: 409 });

  const status = error.status ?? 500;
  const payload = { error: status === 500 ? "Internal server error" : error.message };
  if (error.details) payload.details = error.details;
  res.status(status).json(payload);
}
