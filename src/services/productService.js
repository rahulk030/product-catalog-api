export class ProductService {
  constructor(repository) {
    this.repository = repository;
  }

  async create(input) {
    const existing = await this.repository.findBySku(input.sku);
    if (existing) {
      throw conflict(`A product with SKU ${input.sku.toUpperCase()} already exists`);
    }
    return this.repository.create({ ...input, sku: input.sku.toUpperCase() });
  }

  async getById(id) {
    const product = await this.repository.findById(id);
    if (!product) throw notFound("Product not found");
    return product;
  }

  async list(query) {
    const page = positiveInteger(query.page, 1);
    const limit = Math.min(positiveInteger(query.limit, 20), 100);
    const filters = {
      category: query.category,
      search: query.search,
      isActive: parseBoolean(query.isActive),
      page,
      limit
    };
    const { items, total } = await this.repository.list(filters);
    return {
      items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    };
  }

  async update(id, input) {
    await this.getById(id);
    if (input.sku) {
      const owner = await this.repository.findBySku(input.sku);
      if (owner && String(owner._id) !== id) throw conflict("SKU is already in use");
      input.sku = input.sku.toUpperCase();
    }
    return this.repository.update(id, input);
  }

  async remove(id) {
    const removed = await this.repository.remove(id);
    if (!removed) throw notFound("Product not found");
  }
}

function positiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parseBoolean(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function notFound(message) {
  return Object.assign(new Error(message), { status: 404 });
}

function conflict(message) {
  return Object.assign(new Error(message), { status: 409 });
}
