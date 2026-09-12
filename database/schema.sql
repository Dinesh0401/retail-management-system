-- ============================================
-- Retail Intelligence & Stock Management
-- Database Schema — Supabase PostgreSQL
-- ============================================

-- 1. Branches
CREATE TABLE branches (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  location    TEXT NOT NULL,
  manager_name TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 2. Products
CREATE TABLE products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  category    TEXT NOT NULL,
  sku         TEXT UNIQUE NOT NULL,
  unit_price  NUMERIC NOT NULL CHECK (unit_price > 0),
  cost_price  NUMERIC NOT NULL CHECK (cost_price > 0),
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 3. Sales
CREATE TABLE sales (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id   UUID NOT NULL REFERENCES products(id),
  branch_id    UUID NOT NULL REFERENCES branches(id),
  quantity     INTEGER NOT NULL CHECK (quantity > 0),
  unit_price   NUMERIC NOT NULL CHECK (unit_price > 0),
  total_amount NUMERIC NOT NULL CHECK (total_amount > 0),
  sold_at      TIMESTAMPTZ DEFAULT now()
);

-- 4. Inventory
CREATE TABLE inventory (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    UUID NOT NULL REFERENCES products(id),
  branch_id     UUID NOT NULL REFERENCES branches(id),
  quantity      INTEGER NOT NULL CHECK (quantity >= 0),
  reorder_level INTEGER NOT NULL CHECK (reorder_level >= 0),
  updated_at    TIMESTAMPTZ DEFAULT now(),

  UNIQUE (product_id, branch_id)
);

-- 5. Stock Movements
CREATE TABLE stock_movements (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    UUID NOT NULL REFERENCES products(id),
  branch_id     UUID NOT NULL REFERENCES branches(id),
  movement_type TEXT NOT NULL CHECK (movement_type IN ('IN', 'OUT', 'ADJUSTMENT')),
  quantity      INTEGER NOT NULL CHECK (quantity > 0),
  reason        TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- 6. Decisions
CREATE TABLE decisions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id     UUID NOT NULL REFERENCES branches(id),
  product_id    UUID REFERENCES products(id),
  decision_type TEXT NOT NULL,
  description   TEXT NOT NULL,
  impact        TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Disable Row Level Security (no auth in this mini project)
-- ============================================
ALTER TABLE branches DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE sales DISABLE ROW LEVEL SECURITY;
ALTER TABLE inventory DISABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements DISABLE ROW LEVEL SECURITY;
ALTER TABLE decisions DISABLE ROW LEVEL SECURITY;
