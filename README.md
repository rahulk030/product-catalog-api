# Product Catalog API

A focused REST API for managing products in an e-commerce catalog. The project demonstrates API design, validation, pagination, error handling, MongoDB persistence, and a service layer that can be tested without a database.

## Features

- Create, read, update, and delete catalog products
- Filter by category or active status and search product text
- Paginated list responses with a configurable page size
- Unique SKU enforcement and consistent validation errors
- Security headers, CORS support, health check, and graceful shutdown
- Unit tests for business rules using Node's built-in test runner

## Stack

Node.js, Express, MongoDB, Mongoose, Docker, and the Node test runner.

## Run locally

```bash
cp .env.example .env
docker compose up -d
pnpm install
pnpm dev
```

The API starts at `http://localhost:3000`. Check it with `GET /health`.

## Endpoints

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/products` | List and filter products |
| GET | `/api/products/:id` | Get one product |
| POST | `/api/products` | Create a product |
| PATCH | `/api/products/:id` | Update selected fields |
| DELETE | `/api/products/:id` | Delete a product |

List parameters: `page`, `limit`, `category`, `search`, and `isActive`.

Example request:

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Travel Mug","sku":"MUG-001","category":"Kitchen","price":19.95,"stock":12}'
```

## Test

```bash
pnpm test
```

The business layer accepts a repository dependency, keeping domain rules fast to test and separate from MongoDB.

## Possible next steps

- Add JWT authentication and role-based write access
- Store product images in object storage
- Add integration tests with an isolated MongoDB container
- Publish an OpenAPI specification
