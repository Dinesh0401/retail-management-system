# Retail Intelligence & Stock Management Dashboard

A modern, full-stack dashboard for tracking retail sales, monitoring inventory health, and generating automated reorder decisions.

## Features
- **Product Management (CRUD)**: Create, read, update, and delete products.
- **Branch Management**: View retail branches and locations.
- **Sales Analysis**: Track total revenue, units sold, and top-performing products.
- **Inventory Intelligence**: Automatically flag low-stock items.
- **Stock Movement Tracking**: Monitor stock changes.
- **Automated Reorder Decisions**: System-generated alerts based on stock health.

## Tech Stack
- **Frontend**: React, TypeScript, Recharts, Vite
- **Backend**: Node.js, Express, TypeScript, REST API
- **Database**: Supabase PostgreSQL
- **Testing**: Jest, Supertest

## Architecture
```text
React → REST API (Express) → Controllers → Services → Supabase PostgreSQL
```

## Getting Started

### 1. Database Setup
1. Create a Supabase project.
2. Apply the schema found in `database/schema.sql`. This will create the necessary tables and enable Row Level Security (RLS) with appropriate public API policies.
3. (Optional) Run `database/seed.sql` to populate the database with mock data.

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_anon_key_here
```
Run the development server:
```bash
npm run dev
```
*Runs on http://localhost:5000*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Runs on http://localhost:5173*

## Running Tests
The backend API features a comprehensive test suite using Jest and Supertest.
```bash
cd backend
npm run test
```

## API Endpoints (Products)

### `GET /api/products`
Retrieves a list of all products.

### `POST /api/products`
Creates a new product.
**Payload:**
```json
{
  "name": "Wireless Mouse",
  "sku": "WM-01",
  "category": "electronics",
  "unit_price": 25.99,
  "cost_price": 12.00
}
```

### `PUT /api/products/:id`
Updates an existing product by ID.

### `DELETE /api/products/:id`
Deletes a product by ID.
