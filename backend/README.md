# Backend Documentation

## Overview

The backend is a Node.js/Express application that serves as the API for the WhatsApp Bot Dashboard. It handles:
- Multi-tenant merchant management
- Product and inventory management
- Order processing and fulfillment
- Payment integration with Razorpay
- WhatsApp webhook handling
- Analytics and reporting

## Architecture

### Multi-Tenant Model
The backend uses a **schema-per-tenant** isolation model:
- **Public schema**: Contains shared tenant and admin user data
- **Tenant schemas**: Each merchant gets their own schema (e.g., `tenant_abc123`)
- **RLS (Row-Level Security)**: Database level enforcement of tenant isolation

### Authentication Flow
1. User signs up with phone number
2. OTP sent via Twilio
3. After OTP verification, user sets password
4. JWT token issued with `tenant_id` in app_metadata
5. Subsequent requests use JWT for authentication
6. Tenant_id automatically enforced via RLS

## Project Structure

```
backend/
├── src/
│   ├── api/                 # Route handlers
│   │   ├── auth.js         # Authentication endpoints
│   │   ├── onboarding.js   # Onboarding flow
│   │   ├── products.js     # Product CRUD
│   │   ├── orders.js       # Order management
│   │   ├── payments.js     # Payment endpoints
│   │   ├── analytics.js    # Analytics endpoints
│   │   └── settings.js     # Settings endpoints
│   │
│   ├── middleware/          # Express middleware
│   │   ├── auth.js         # JWT verification & authorization
│   │   └── errorHandler.js # Error handling & logging
│   │
│   ├── services/            # Business logic (TBD)
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── orderService.js
│   │   ├── paymentService.js
│   │   └── analyticsService.js
│   │
│   ├── database/
│   │   ├── supabase.js     # Supabase client initialization
│   │   └── migrations/     # SQL migration files
│   │       ├── 001_create_public_schema.sql
│   │       └── 002_create_tenant_schema_template.sql
│   │
│   ├── webhooks/            # Webhook handlers (TBD)
│   │   ├── whatsappWebhook.js
│   │   └── razorpayWebhook.js
│   │
│   ├── utils/               # Utility functions
│   │   ├── validators.js
│   │   ├── helpers.js
│   │   └── cloud.js
│   │
│   ├── types/               # TypeScript-like type definitions (JSDoc)
│   │   └── schemas.js
│   │
│   └── app.js              # Main Express application
│
├── .env.example            # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Razorpay account
- Twilio account

### Installation Steps

1. **Install dependencies**:
```bash
npm install
```

2. **Environment Setup**:
```bash
cp .env.example .env
```

3. **Fill environment variables**:
```env
# Server
NODE_ENV=development
PORT=5000
JWT_SECRET=your_random_secret_key
JWT_EXPIRY=1h
JWT_REFRESH_EXPIRY=7d

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key

# Cloudflare R2
R2_ENDPOINT=https://your-account.r2.cloudflarestorage.com
R2_ACCESS_KEY=your_access_key
R2_SECRET_KEY=your_secret_key
R2_BUCKET_NAME=whatsapp-bot-images

# Twilio (OTP)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890

# Razorpay
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret

# WhatsApp
WHATSAPP_BUSINESS_ACCOUNT_ID=your_account_id
WHATSAPP_API_VERSION=v18.0
```

4. **Setup Database**:
Execute migrations in order:
```bash
# This needs to be implemented
npm run migrate
```

5. **Start Development Server**:
```bash
npm run dev
```

Server runs on `http://localhost:5000`

## API Endpoints

### Authentication (6 endpoints)

#### POST /api/auth/signup-with-otp
Send OTP to phone number for signup

**Request**:
```json
{
  "phone": "+919876543210",
  "business_name": "My Business",
  "email": "business@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "OTP sent to your phone",
  "phone": "+919876543210"
}
```

#### POST /api/auth/verify-otp
Verify OTP and get setup token

**Request**:
```json
{
  "phone": "+919876543210",
  "otp": "123456"
}
```

**Response**:
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "setup_token": "eyJhbGc...",
  "tenant_id": "tenant_abc123"
}
```

#### POST /api/auth/set-password
Set password and create account

**Headers**:
```
setup_token: Bearer eyJhbGc...
```

**Request**:
```json
{
  "phone": "+919876543210",
  "password": "SecurePass123",
  "confirm_password": "SecurePass123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Password set successfully",
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "phone": "+919876543210",
    "tenant_id": "tenant_abc123",
    "role": "owner"
  }
}
```

#### POST /api/auth/login
Login with phone and password

**Request**:
```json
{
  "phone": "+919876543210",
  "password": "SecurePass123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "phone": "+919876543210",
    "tenant_id": "tenant_abc123",
    "role": "owner"
  }
}
```

#### POST /api/auth/refresh-token
Get new access token using refresh token

**Request**:
```json
{
  "refresh_token": "eyJhbGc..."
}
```

**Response**:
```json
{
  "success": true,
  "access_token": "eyJhbGc..."
}
```

#### GET /api/auth/me
Get current user profile (requires Bearer token)

**Headers**:
```
Authorization: Bearer eyJhbGc...
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "phone": "+919876543210",
    "tenant_id": "tenant_abc123",
    "role": "owner",
    "is_active": true,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### Products (7 endpoints)

All product endpoints require authentication and accept `tenant_id` automatically from JWT.

#### GET /api/admin/products
List all products with pagination

**Query Parameters**:
- `limit`: Number of products per page (default: 20)
- `offset`: Number of products to skip (default: 0)
- `category`: Filter by category
- `status`: Filter by status (active, archived)

**Headers**:
```
Authorization: Bearer eyJhbGc...
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Product Name",
      "sku": "PROD001",
      "price": 1500,
      "cost_price": 1000,
      "stock_quantity": 50,
      "status": "active"
    }
  ],
  "total": 245,
  "page": 1,
  "limit": 20
}
```

#### POST /api/admin/products
Create new product

**Request**:
```json
{
  "name": "Product Name",
  "description": "Product description",
  "sku": "PROD001",
  "category": "Electronics",
  "base_price": 1500,
  "cost_price": 1000,
  "tax_rate": 5,
  "stock_quantity": 50,
  "reorder_level": 10,
  "meta_title": "SEO Title",
  "meta_description": "SEO Description"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Product created",
  "product_id": "uuid"
}
```

#### PUT /api/admin/products/:id
Update product

#### DELETE /api/admin/products/:id
Delete product

#### POST /api/admin/products/:id/variants
Add product variant

**Request**:
```json
{
  "variant_name": "Red Large",
  "variant_sku": "PROD001-RED-L",
  "variant_price": 1500,
  "variant_stock": 30,
  "size": "Large",
  "color": "Red"
}
```

#### POST /api/admin/products/:id/adjust-inventory
Adjust inventory

**Request**:
```json
{
  "quantity_change": 10,
  "reason": "stock_addition",
  "reference_id": "REF001"
}
```

#### GET /api/admin/products/low-stock
Get products below reorder level

### Orders (5 endpoints)

#### GET /api/admin/orders
List orders with filters

**Query Parameters**:
- `status`: Filter by order status
- `payment_status`: Filter by payment status
- `date_from`: Start date for filtering
- `date_to`: End date for filtering

#### GET /api/admin/orders/:id
Get order details

#### PUT /api/admin/orders/:id/status
Update order status

**Request**:
```json
{
  "status": "shipped",
  "notes": "Order shipped via courier"
}
```

#### GET /api/admin/orders/:id/invoice
Generate invoice (returns PDF URL)

#### POST /api/admin/orders/:id/return-request
Create return request

**Request**:
```json
{
  "return_reason": "Product damaged",
  "notes": "Item arrived with broken packaging"
}
```

### Payments (3 endpoints)

#### GET /api/admin/payments
List payments with filtering

#### GET /api/admin/payments/settlements
Get settlements data

**Response**:
```json
{
  "success": true,
  "settlements": [
    {
      "id": "uuid",
      "settlement_id": "SETTLE001",
      "settlement_period_start": "2024-01-01",
      "settlement_period_end": "2024-01-31",
      "total_orders": 150,
      "gross_amount": 225000,
      "commission_amount": 11250,
      "net_amount": 213750,
      "status": "processed"
    }
  ]
}
```

#### POST /api/admin/payments/:id/refund
Process refund

**Request**:
```json
{
  "refund_amount": 1500,
  "reason": "Customer requested"
}
```

### Analytics (3 endpoints)

#### GET /api/admin/analytics/summary
Get dashboard summary

**Response**:
```json
{
  "success": true,
  "summary": {
    "total_orders": 245,
    "total_revenue": 367500,
    "total_products": 89,
    "active_customers": 156
  }
}
```

#### GET /api/admin/analytics/sales-trend
Get sales trending data

#### GET /api/admin/analytics/top-products
Get top selling products

### Settings (4 endpoints)

#### GET /api/admin/settings
Get all settings

#### PUT /api/admin/settings
Update settings

#### GET /api/admin/settings/profile
Get merchant profile

#### PUT /api/admin/settings/profile
Update merchant profile

## Middleware

### Authentication Middleware (`authenticateToken`)
- Verifies JWT token
- Extracts tenant_id from JWT
- Adds user info to request object
- Returns 401 if token invalid or missing

### Authorization Middleware (`authorize`)
- Checks user role
- Restricts access based on roles
- Returns 403 if insufficient permissions

### Error Handler Middleware
- Catches all errors
- Logs to Winston logger
- Returns consistent error response
- Different error messages for production vs development

## Database Schema

### Public Schema Tables
- `tenants` - Merchant accounts
- `admin_users` - Team members
- `tenant_kyc_documents` - KYC verification
- `tenant_bank_verification` - Bank details
- `tenant_settings` - Business settings

### Tenant Schema Tables (per merchant)
- `products` - Product catalog
- `product_variants` - Size/color variants
- `product_inventory_history` - Inventory audit trail
- `users` - Customers
- `user_sessions` - Conversation state
- `carts` - Shopping carts
- `orders` - Order records
- `order_status_history` - Order timeline
- `order_returns` - Return requests
- `payments` - Payment records
- `settlements` - Settlement batches
- `conversation_history` - Bot conversations

## Security Features

### 1. Row-Level Security (RLS)
- Database level enforcement
- Queries automatically filtered by tenant_id
- Cannot access other tenant's data even with compromised JWT

### 2. JWT with Tenant ID
```javascript
{
  sub: user_id,
  email: user_email,
  app_metadata: {
    tenant_id: "tenant_abc123",  // Immutable
    role: "admin"
  }
}
```

### 3. Webhook Verification
- HMAC-SHA256 signature verification
- Prevents unauthorized webhook calls

### 4. Encrypted Secrets
- Supabase Vault for sensitive data
- Environment variables for deployment secrets

## Error Handling

All errors return consistent format:
```json
{
  "success": false,
  "error": "Error message",
  "status": 400
}
```

Error codes:
- 400 - Bad Request (validation failed)
- 401 - Unauthorized (missing/invalid token)
- 403 - Forbidden (insufficient permissions)
- 404 - Not Found
- 409 - Conflict (duplicate resource)
- 500 - Internal Server Error

## Logging

Using Winston logger with:
- Console output for development
- File output for production
- Log levels: info, warn, error
- JSON format for structured logging

## Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test src/api/auth.test.js

# Run with coverage
npm test -- --coverage
```

## Deployment

### Docker
```bash
docker build -t whatsapp-bot-backend .
docker run -p 5000:5000 --env-file .env whatsapp-bot-backend
```

### Environment for Production
- Set `NODE_ENV=production`
- Use strong JWT_SECRET
- Enable CORS only for frontend domain
- Set database connection pool appropriately
- Configure logging to persistent storage
- Set up health check endpoint monitoring

## Development Tips

1. **OTP in Development**: Check logs for OTP code instead of waiting for SMS
2. **Database Queries**: Use Supabase dashboard to verify data
3. **API Testing**: Use Postman or curl with Bearer token
4. **Rate Limiting**: Can be added with express-rate-limit
5. **Caching**: Implement with Redis for high traffic

## Known Limitations

- OTP cache is in-memory (not persistent)
- No rate limiting yet
- No API versioning
- Limited to Supabase as database
- No API documentation auto-generation

## Future Enhancements

- [ ] API documentation with Swagger/OpenAPI
- [ ] Redis caching layer
- [ ] GraphQL endpoint option
- [ ] Message queue for async operations
- [ ] Advanced analytics with data warehouse
- [ ] Webhook retry mechanism
- [ ] API versioning strategy
