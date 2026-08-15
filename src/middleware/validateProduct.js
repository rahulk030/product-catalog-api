const allowedFields = ["name", "description", "sku", "category", "price", "stock", "isActive"];

export function validateProduct({ partial = false } = {}) {
  return (req, _res, next) => {
    const errors = [];
    const body = req.body ?? {};

    for (const field of Object.keys(body)) {
      if (!allowedFields.includes(field)) errors.push(`${field} is not allowed`);
    }
    if (!partial) {
      for (const field of ["name", "sku", "category", "price", "stock"]) {
        if (body[field] === undefined || body[field] === "") errors.push(`${field} is required`);
      }
    }
    for (const field of ["name", "sku", "category"]) {
      if (body[field] !== undefined && typeof body[field] !== "string") errors.push(`${field} must be text`);
    }
    if (body.price !== undefined && (!Number.isFinite(body.price) || body.price < 0)) {
      errors.push("price must be a non-negative number");
    }
    if (body.stock !== undefined && (!Number.isInteger(body.stock) || body.stock < 0)) {
      errors.push("stock must be a non-negative integer");
    }
    if (body.isActive !== undefined && typeof body.isActive !== "boolean") {
      errors.push("isActive must be true or false");
    }

    if (errors.length) {
      return next(Object.assign(new Error("Validation failed"), { status: 400, details: errors }));
    }
    next();
  };
}
