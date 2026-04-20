-- This migration demonstrates the tenant schema structure
-- Each tenant gets their own schema: tenant_abc123, tenant_xyz789, etc.
-- Replace {tenant_schema} with actual tenant_id when creating dynamically

-- Table: {tenant_schema}.products
CREATE TABLE IF NOT EXISTS {tenant_schema}.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sku VARCHAR(100) UNIQUE,
  category VARCHAR(100),
  base_price DECIMAL(10, 2) NOT NULL,
  cost_price DECIMAL(10, 2),
  tax_rate DECIMAL(5, 2) DEFAULT 0,
  stock_quantity INT DEFAULT 0,
  reorder_level INT DEFAULT 10,
  status VARCHAR(50) DEFAULT 'active',
  image_url TEXT,
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table: {tenant_schema}.product_variants
CREATE TABLE IF NOT EXISTS {tenant_schema}.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES {tenant_schema}.products(id),
  variant_name VARCHAR(100),
  variant_sku VARCHAR(100) UNIQUE,
  variant_price DECIMAL(10, 2),
  variant_stock INT DEFAULT 0,
  size VARCHAR(50),
  color VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table: {tenant_schema}.product_inventory_history
CREATE TABLE IF NOT EXISTS {tenant_schema}.product_inventory_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES {tenant_schema}.products(id),
  action VARCHAR(50),
  quantity_change INT,
  reason VARCHAR(255),
  reference_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table: {tenant_schema}.users (Customers)
CREATE TABLE IF NOT EXISTS {tenant_schema}.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255),
  email VARCHAR(255),
  language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table: {tenant_schema}.user_sessions
CREATE TABLE IF NOT EXISTS {tenant_schema}.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES {tenant_schema}.users(id),
  current_step VARCHAR(50),
  conversation_context JSONB,
  last_activity TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- Table: {tenant_schema}.carts
CREATE TABLE IF NOT EXISTS {tenant_schema}.carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES {tenant_schema}.users(id),
  items JSONB,
  subtotal DECIMAL(10, 2),
  tax DECIMAL(10, 2),
  total DECIMAL(10, 2),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table: {tenant_schema}.orders
CREATE TABLE IF NOT EXISTS {tenant_schema}.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(100) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES {tenant_schema}.users(id),
  items JSONB NOT NULL,
  customer_name VARCHAR(255),
  customer_phone VARCHAR(20),
  customer_email VARCHAR(255),
  delivery_address TEXT,
  promotional_code VARCHAR(50),
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  subtotal DECIMAL(10, 2),
  tax DECIMAL(10, 2),
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'pending',
  razorpay_order_id VARCHAR(100),
  order_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table: {tenant_schema}.order_status_history
CREATE TABLE IF NOT EXISTS {tenant_schema}.order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES {tenant_schema}.orders(id),
  status_from VARCHAR(50),
  status_to VARCHAR(50),
  changed_by VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table: {tenant_schema}.order_returns
CREATE TABLE IF NOT EXISTS {tenant_schema}.order_returns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES {tenant_schema}.orders(id),
  return_reason VARCHAR(255),
  return_status VARCHAR(50) DEFAULT 'pending',
  refund_status VARCHAR(50) DEFAULT 'pending',
  refund_amount DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table: {tenant_schema}.payments
CREATE TABLE IF NOT EXISTS {tenant_schema}.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES {tenant_schema}.orders(id),
  razorpay_payment_id VARCHAR(100),
  razorpay_signature VARCHAR(255),
  amount DECIMAL(10, 2),
  commission_amount DECIMAL(10, 2),
  net_amount DECIMAL(10, 2),
  settled_amount DECIMAL(10, 2) DEFAULT 0,
  settlement_id UUID,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table: {tenant_schema}.settlements
CREATE TABLE IF NOT EXISTS {tenant_schema}.settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  settlement_id VARCHAR(100) UNIQUE NOT NULL,
  settlement_period_start DATE,
  settlement_period_end DATE,
  total_orders INT,
  gross_amount DECIMAL(15, 2),
  commission_amount DECIMAL(15, 2),
  net_amount DECIMAL(15, 2),
  status VARCHAR(50) DEFAULT 'processed',
  payout_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table: {tenant_schema}.conversation_history
CREATE TABLE IF NOT EXISTS {tenant_schema}.conversation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES {tenant_schema}.users(id),
  message_type VARCHAR(50),
  message_text TEXT,
  intent VARCHAR(100),
  intent_confidence DECIMAL(3, 2),
  response_text TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_status ON {tenant_schema}.products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON {tenant_schema}.products(category);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON {tenant_schema}.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_users_phone ON {tenant_schema}.users(phone);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON {tenant_schema}.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON {tenant_schema}.carts(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON {tenant_schema}.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON {tenant_schema}.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON {tenant_schema}.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_conversation_user_id ON {tenant_schema}.conversation_history(user_id);

-- Enable RLS for tenant tables
ALTER TABLE {tenant_schema}.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE {tenant_schema}.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE {tenant_schema}.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE {tenant_schema}.payments ENABLE ROW LEVEL SECURITY;
