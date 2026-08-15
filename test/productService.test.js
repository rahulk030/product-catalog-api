import assert from "node:assert/strict";
import test from "node:test";
import { ProductService } from "../src/services/productService.js";

class MemoryRepository {
  constructor(items = []) {
    this.items = items.map((item) => ({ ...item }));
  }
  async create(data) {
    const item = { _id: String(this.items.length + 1), ...data };
    this.items.push(item);
    return item;
  }
  async findById(id) { return this.items.find((item) => item._id === id) ?? null; }
  async findBySku(sku) { return this.items.find((item) => item.sku === sku.toUpperCase()) ?? null; }
  async list({ category, page, limit }) {
    const filtered = category ? this.items.filter((item) => item.category === category) : this.items;
    return { items: filtered.slice((page - 1) * limit, page * limit), total: filtered.length };
  }
  async update(id, data) {
    const index = this.items.findIndex((item) => item._id === id);
    this.items[index] = { ...this.items[index], ...data };
    return this.items[index];
  }
  async remove(id) {
    const index = this.items.findIndex((item) => item._id === id);
    if (index < 0) return null;
    return this.items.splice(index, 1)[0];
  }
}

const sample = { _id: "1", name: "Travel Mug", sku: "MUG-001", category: "Kitchen", price: 19.95, stock: 12 };

test("creates a product and normalizes its SKU", async () => {
  const service = new ProductService(new MemoryRepository());
  const created = await service.create({ ...sample, _id: undefined, sku: "mug-001" });
  assert.equal(created.sku, "MUG-001");
});

test("rejects duplicate SKUs", async () => {
  const service = new ProductService(new MemoryRepository([sample]));
  await assert.rejects(() => service.create({ ...sample, _id: undefined }), { status: 409 });
});

test("returns predictable pagination metadata", async () => {
  const service = new ProductService(new MemoryRepository([sample]));
  const result = await service.list({ page: "1", limit: "10" });
  assert.deepEqual(result.pagination, { page: 1, limit: 10, total: 1, pages: 1 });
});

test("returns a 404-style error for a missing product", async () => {
  const service = new ProductService(new MemoryRepository());
  await assert.rejects(() => service.getById("missing"), { status: 404 });
});
