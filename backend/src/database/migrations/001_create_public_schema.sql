-- Create public schema tables
-- Table: tenants (Merchant accounts)
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id VARCHAR(50) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255),
  business_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  webhook_secret UUID DEFAULT gen_random_uuid(),
  commission_rate DECIMAL(5, 2) DEFAULT 5.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table: admin_users (Team members)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id VARCHAR(50) NOT NULL REFERENCES public.tenants(tenant_id),
  phone VARCHAR(20),
  email VARCHAR(255),
  password_hash VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id, phone)
);

-- Table: tenant_kyc_documents
CREATE TABLE IF NOT EXISTS public.tenant_kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id VARCHAR(50) NOT NULL REFERENCES public.tenants(tenant_id),
  document_type VARCHAR(50),
  document_url TEXT,
  verification_status VARCHAR(50) DEFAULT 'pending',
  verified_by VARCHAR(255),
  verification_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table: tenant_bank_verification
CREATE TABLE IF NOT EXISTS public.tenant_bank_verification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id VARCHAR(50) NOT NULL REFERENCES public.tenants(tenant_id),
  account_holder_name VARCHAR(255),
  account_number VARCHAR(50),
  ifsc_code VARCHAR(20),
  bank_name VARCHAR(255),
  verification_status VARCHAR(50) DEFAULT 'pending',
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id)
);

-- Table: tenant_settings
CREATE TABLE IF NOT EXISTS public.tenant_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id VARCHAR(50) NOT NULL REFERENCES public.tenants(tenant_id),
  shipping_policy TEXT,
  return_policy TEXT,
  refund_policy TEXT,
  min_order_value DECIMAL(10, 2) DEFAULT 0,
  max_order_value DECIMAL(10, 2),
  timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tenants_tenant_id ON public.tenants(tenant_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_tenant_id ON public.admin_users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_kyc_documents_tenant_id ON public.tenant_kyc_documents(tenant_id);
CREATE INDEX IF NOT EXISTS idx_bank_verification_tenant_id ON public.tenant_bank_verification(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_settings_tenant_id ON public.tenant_settings(tenant_id);

-- Enable RLS policies
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_bank_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_users to filter by tenant_id
CREATE POLICY admin_users_tenant_filter ON public.admin_users
  AS SELECT
  USING (tenant_id = (auth.jwt()->'app_metadata'->>'tenant_id'));

CREATE POLICY admin_users_tenant_update ON public.admin_users
  AS UPDATE
  USING (tenant_id = (auth.jwt()->'app_metadata'->>'tenant_id'))
  WITH CHECK (tenant_id = (auth.jwt()->'app_metadata'->>'tenant_id'));

-- Create policies for tenant_kyc_documents
CREATE POLICY kyc_docs_tenant_filter ON public.tenant_kyc_documents
  AS SELECT
  USING (tenant_id = (auth.jwt()->'app_metadata'->>'tenant_id'));

-- Log migration
INSERT INTO public._migration_logs (migration_name, status, created_at)
VALUES ('001_create_public_schema', 'completed', NOW())
ON CONFLICT DO NOTHING;
