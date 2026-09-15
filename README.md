# SILKOS: Retail Intelligence & Inventory Decision System

SILKOS is a multi-branch retail intelligence system designed to answer one critical business question:
> **"A product is selling or stocking differently across branches. What should the business do?"**

Rather than functioning simply as a billing system or e-commerce storefront, SILKOS intelligently monitors branch-wise inventory and generates actionable transfer or reorder decisions to optimize stock across locations.

## The Business Flow

SILKOS operates on four core pillars:

1. **Products (What we sell)**: A complete CRUD interface to manage the retail catalog (e.g., LED Desk Lamps, Silk Sarees).
2. **Branches (Where we sell it)**: Represents the physical retail locations (e.g., Chennai, Salem, Coimbatore).
3. **Inventory (How much we have)**: Managers assign stock levels and reorder thresholds for specific products at specific branches.
4. **Decision Engine (The Brain)**: A deterministic TypeScript rules-engine that evaluates stock health and intelligently routes inventory.

## The Intelligence Engine

When an item's stock drops below its reorder threshold at a specific branch, SILKOS doesn't just blindly suggest ordering more. It checks the broader ecosystem:

- **TRANSFER RECOMMENDED**: If Chennai is low on LED Lamps, but Salem has a surplus, the system recommends transferring the excess stock from Salem to Chennai.
- **REORDER REQUIRED**: If all branches are running low, the system recommends a standard supplier reorder.
- **UNMONITORED**: Newly created products default to 0 stock and 0 reorder level. The system intelligently ignores these until a manager actively assigns inventory targets, preventing artificial low-stock alerts.

## Tech Stack
- **Frontend**: React, TypeScript, Recharts, Vite
- **Backend**: Node.js, Express, TypeScript, REST API
- **Database**: Supabase PostgreSQL
- **Testing**: Jest, Supertest

## Getting Started

### 1. Database Setup
1. Create a Supabase project.
2. Apply the schema found in `database/schema.sql` to create tables and enable RLS.
3. Run `database/seed.sql` to populate initial branches and products.

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

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Runs on http://localhost:5173*

## Testing the Engine
The backend features a comprehensive test suite covering the decision engine's logic (Transfers, Reorders, Unmonitored states) and Product CRUD operations.
```bash
cd backend
npm test
```
