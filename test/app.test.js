import assert from "node:assert/strict";
import test from "node:test";
import { createApp } from "../src/app.js";

class MemoryRepository {
  constructor() { this.items = []; }
  async findBySku(sku) { return this.items.find((item) => item.sku === sku.toUpperCase()) ?? null; }
  async create(data) {
    const item = { _id: String(this.items.length + 1), ...data };
    this.items.push(item);
    return item;
  }
  async list({ page, limit }) {
    return { items: this.items.slice((page - 1) * limit, page * limit), total: this.items.length };
  }
  async findById(id) { return this.items.find((item) => item._id === id) ?? null; }
  async update() { throw new Error("Not used in this test"); }
  async remove() { throw new Error("Not used in this test"); }
}

test("creates and lists a product through the HTTP API", async (t) => {
  const server = createApp({ repository: new MemoryRepository() }).listen(0);
  t.after(() => server.close());
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();

  const createdResponse = await fetch(`http://127.0.0.1:${port}/api/products`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: "Travel Mug", sku: "mug-001", category: "Kitchen", price: 19.95, stock: 12
    })
  });
  assert.equal(createdResponse.status, 201);
  assert.equal((await createdResponse.json()).sku, "MUG-001");

  const listResponse = await fetch(`http://127.0.0.1:${port}/api/products`);
  assert.equal(listResponse.status, 200);
  const body = await listResponse.json();
  assert.equal(body.items.length, 1);
  assert.equal(body.pagination.total, 1);
});

test("returns useful validation details", async (t) => {
  const server = createApp({ repository: new MemoryRepository() }).listen(0);
  t.after(() => server.close());
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();

  const response = await fetch(`http://127.0.0.1:${port}/api/products`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "Incomplete product" })
  });
  assert.equal(response.status, 400);
  const body = await response.json();
  assert.equal(body.error, "Validation failed");
  assert.ok(body.details.includes("sku is required"));
});
