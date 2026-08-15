import { Product } from "../models/product.js";

export class ProductRepository {
  async create(data) {
    return Product.create(data);
  }

  async findById(id) {
    return Product.findById(id).lean();
  }

  async findBySku(sku) {
    return Product.findOne({ sku: sku.toUpperCase() }).lean();
  }

  async list({ category, search, isActive, page, limit }) {
    const filter = {};
    if (category) filter.category = category;
    if (typeof isActive === "boolean") filter.isActive = isActive;
    if (search) filter.$text = { $search: search };

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter)
    ]);
    return { items, total };
  }

  async update(id, data) {
    return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
  }

  async remove(id) {
    return Product.findByIdAndDelete(id).lean();
  }
}
