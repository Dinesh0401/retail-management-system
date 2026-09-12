-- ============================================
-- Seed Data — Realistic retail records
-- ============================================
-- Uses fixed UUIDs so foreign keys connect correctly.
-- Run this AFTER schema.sql.

-- ────────────────────────────────────────────
-- Branches (2)
-- ────────────────────────────────────────────
INSERT INTO branches (id, name, location, manager_name) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Downtown Central',  'MG Road, Bangalore',   'Priya Sharma'),
  ('b0000000-0000-0000-0000-000000000002', 'Lakeside Mall',     'Whitefield, Bangalore', 'Arjun Reddy');

-- ────────────────────────────────────────────
-- Products (5)
-- ────────────────────────────────────────────
INSERT INTO products (id, name, category, sku, unit_price, cost_price) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Basmati Rice 5kg',      'grocery',     'GRO-RICE-001', 320.00, 260.00),
  ('c0000000-0000-0000-0000-000000000002', 'Toor Dal 1kg',          'grocery',     'GRO-DAL-002',  140.00, 105.00),
  ('c0000000-0000-0000-0000-000000000003', 'Wireless Mouse',        'electronics', 'ELE-MOU-003',  650.00, 420.00),
  ('c0000000-0000-0000-0000-000000000004', 'LED Desk Lamp',         'electronics', 'ELE-LMP-004',  890.00, 580.00),
  ('c0000000-0000-0000-0000-000000000005', 'Cotton T-Shirt (M)',    'clothing',    'CLO-TSH-005',  499.00, 280.00);

-- ────────────────────────────────────────────
-- Inventory (each product at each branch = 10 records)
-- ────────────────────────────────────────────
INSERT INTO inventory (product_id, branch_id, quantity, reorder_level) VALUES
  -- Downtown Central
  ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001',  45, 20),
  ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001',  30, 15),
  ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001',  12,  5),
  ('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001',   8,  5),
  ('c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001',  60, 25),
  -- Lakeside Mall
  ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002',  35, 20),
  ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002',  18, 15),
  ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002',  20,  5),
  ('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000002',   3,  5),
  ('c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000002',  40, 25);

-- ────────────────────────────────────────────
-- Sales (6 records)
-- ────────────────────────────────────────────
INSERT INTO sales (product_id, branch_id, quantity, unit_price, total_amount, sold_at) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001',  3, 320.00,  960.00, now() - INTERVAL '2 days'),
  ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001',  1, 650.00,  650.00, now() - INTERVAL '1 day'),
  ('c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001',  4, 499.00, 1996.00, now() - INTERVAL '3 hours'),
  ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002',  5, 140.00,  700.00, now() - INTERVAL '1 day'),
  ('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000002',  2, 890.00, 1780.00, now() - INTERVAL '5 hours'),
  ('c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000002',  3, 499.00, 1497.00, now() - INTERVAL '30 minutes');

-- ────────────────────────────────────────────
-- Stock Movements (5 records)
-- ────────────────────────────────────────────
INSERT INTO stock_movements (product_id, branch_id, movement_type, quantity, reason) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'IN',         50, 'Supplier restock delivery'),
  ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', 'IN',         15, 'New stock from distributor'),
  ('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000002', 'OUT',         2, 'Damaged items returned to supplier'),
  ('c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001', 'ADJUSTMENT',  5, 'Inventory audit correction'),
  ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'IN',         20, 'Weekly restocking');

-- ────────────────────────────────────────────
-- Decisions (3 records)
-- ────────────────────────────────────────────
INSERT INTO decisions (branch_id, product_id, decision_type, description, impact) VALUES
  ('b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000004', 'restock',
   'LED Desk Lamp stock at Lakeside Mall is below reorder level (3 remaining, threshold 5). Place restock order.',
   'Prevents stockout and lost sales estimated at ₹2,670/week'),
  ('b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000005', 'pricing',
   'Cotton T-Shirt sales are strong at Downtown Central. Consider a 10% promotional discount to clear excess stock.',
   'Could increase weekly unit sales by 20–30%'),
  ('b0000000-0000-0000-0000-000000000002', NULL, 'transfer',
   'Lakeside Mall has lower Toor Dal stock (18) compared to Downtown (30). Consider inter-branch transfer of 10 units.',
   'Balances inventory across branches and reduces Downtown overstock');
