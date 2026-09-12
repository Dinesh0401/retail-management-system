# Database Schema — Retail Intelligence & Stock Management

## Overview

6 PostgreSQL tables hosted on **Supabase**. All tables use UUID primary keys with auto-generation via `gen_random_uuid()`.

---

## Tables

### 1. `branches`

Stores retail branch/store locations.

| Column       | Type        | Constraints              |
|--------------|-------------|--------------------------|
| id           | UUID        | PRIMARY KEY, auto-generated |
| name         | TEXT        | NOT NULL                 |
| location     | TEXT        | NOT NULL                 |
| manager_name | TEXT        | nullable                 |
| created_at   | TIMESTAMPTZ | DEFAULT now()            |

---

### 2. `products`

Stores retail product catalog.

| Column     | Type        | Constraints              |
|------------|-------------|--------------------------|
| id         | UUID        | PRIMARY KEY, auto-generated |
| name       | TEXT        | NOT NULL                 |
| category   | TEXT        | NOT NULL                 |
| sku        | TEXT        | UNIQUE, NOT NULL         |
| unit_price | NUMERIC     | NOT NULL, CHECK (> 0)    |
| cost_price | NUMERIC     | NOT NULL, CHECK (> 0)    |
| created_at | TIMESTAMPTZ | DEFAULT now()            |

---

### 3. `sales`

Records individual sale transactions.

| Column       | Type        | Constraints                    |
|--------------|-------------|--------------------------------|
| id           | UUID        | PRIMARY KEY, auto-generated    |
| product_id   | UUID        | NOT NULL, FK → products(id)    |
| branch_id    | UUID        | NOT NULL, FK → branches(id)    |
| quantity     | INTEGER     | NOT NULL, CHECK (> 0)          |
| unit_price   | NUMERIC     | NOT NULL, CHECK (> 0)          |
| total_amount | NUMERIC     | NOT NULL, CHECK (> 0)          |
| sold_at      | TIMESTAMPTZ | DEFAULT now()                  |

---

### 4. `inventory`

Tracks current stock levels per product per branch.

| Column        | Type        | Constraints                    |
|---------------|-------------|--------------------------------|
| id            | UUID        | PRIMARY KEY, auto-generated    |
| product_id    | UUID        | NOT NULL, FK → products(id)    |
| branch_id     | UUID        | NOT NULL, FK → branches(id)    |
| quantity      | INTEGER     | NOT NULL, CHECK (>= 0)         |
| reorder_level | INTEGER     | NOT NULL, CHECK (>= 0)         |
| updated_at    | TIMESTAMPTZ | DEFAULT now()                  |

**Unique constraint**: `(product_id, branch_id)` — each product has exactly one inventory record per branch.

---

### 5. `stock_movements`

Logs stock movements in/out of branches.

| Column        | Type        | Constraints                              |
|---------------|-------------|------------------------------------------|
| id            | UUID        | PRIMARY KEY, auto-generated              |
| product_id    | UUID        | NOT NULL, FK → products(id)              |
| branch_id     | UUID        | NOT NULL, FK → branches(id)              |
| movement_type | TEXT        | NOT NULL, CHECK (IN, OUT, ADJUSTMENT)    |
| quantity      | INTEGER     | NOT NULL, CHECK (> 0)                    |
| reason        | TEXT        | nullable                                 |
| created_at    | TIMESTAMPTZ | DEFAULT now()                            |

**Allowed movement types**: `IN`, `OUT`, `ADJUSTMENT`

---

### 6. `decisions`

Stores business decisions and recommendations.

| Column        | Type        | Constraints                    |
|---------------|-------------|--------------------------------|
| id            | UUID        | PRIMARY KEY, auto-generated    |
| branch_id     | UUID        | NOT NULL, FK → branches(id)    |
| product_id    | UUID        | nullable, FK → products(id)    |
| decision_type | TEXT        | NOT NULL                       |
| description   | TEXT        | NOT NULL                       |
| impact        | TEXT        | nullable                       |
| created_at    | TIMESTAMPTZ | DEFAULT now()                  |

---

## Relationships

```
branches ──┬── sales          (branch_id)
            ├── inventory      (branch_id)
            ├── stock_movements(branch_id)
            └── decisions      (branch_id)

products ──┬── sales          (product_id)
            ├── inventory      (product_id)
            ├── stock_movements(product_id)
            └── decisions      (product_id, nullable)
```

---

## Constraints Summary

| Table           | Constraint                                  |
|-----------------|---------------------------------------------|
| products        | sku is UNIQUE                               |
| products        | unit_price > 0, cost_price > 0              |
| sales           | quantity > 0, unit_price > 0, total_amount > 0 |
| inventory       | quantity >= 0, reorder_level >= 0           |
| inventory       | UNIQUE (product_id, branch_id)              |
| stock_movements | quantity > 0                                |
| stock_movements | movement_type IN ('IN', 'OUT', 'ADJUSTMENT') |

---

## SQL Files

| File                  | Purpose                          |
|-----------------------|----------------------------------|
| `database/schema.sql` | CREATE TABLE statements          |
| `database/seed.sql`   | Realistic sample data (2 branches, 5 products) |

### How to use

1. Open the **Supabase SQL Editor**.
2. Run `schema.sql` first to create the tables.
3. Run `seed.sql` to insert the sample data.
