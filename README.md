# WhatsApp Bot Dashboard

A production-ready multi-tenant WhatsApp e-commerce dashboard for managing merchants, products, orders, payments, and analytics.

## Project Structure

```
Dashboard/
├── backend/          # Node.js/Express API server
│   ├── src/
│   │   ├── api/     # Route handlers
│   │   ├── middleware/  # Auth & error handling
│   │   ├── services/    # Business logic
│   │   ├── database/    # DB connection & migrations
│   │   ├── webhooks/    # WhatsApp & Razorpay webhooks
│   │   ├── utils/       # Helper functions
│   │   └── app.js       # Express app
│   ├── package.json
│   ├── .env.example
│   └── README.md
└── frontend/         # React dashboard UI
    ├── src/
    │   ├── pages/       # Page components
    │   ├── components/  # Reusable components
    │   ├── api/         # API client
    │   ├── store/       # State management (Zustand)
    │   ├── hooks/       # Custom React hooks
    │   ├── styles/      # CSS files
    │   ├── App.js
    │   └── index.js
    ├── public/
    ├── package.json
    ├── .env.example
    ├── tailwind.config.js
    └── postcss.config.js
```

## Key Features

### 🏪 Merchant Management
- Multi-tenant SaaS architecture with schema-per-tenant model
- Merchant onboarding with KYC verification
- Admin user management with role-based access control
- Bank account verification for settlements

### 📦 Product Management
- Product catalog with variants (size, color, etc.)
- SKU management and cost price tracking
- Inventory tracking with reorder level alerts
- Enhanced product metadata (SEO, descriptions)

### 🛒 Order Management
- Real-time order tracking and status updates
- Order fulfillment workflow
- Return and refund management
- Invoice generation

### 💳 Payment Integration
- Razorpay payment gateway integration
- Payment tracking and dispute handling
- Daily settlement calculations
- Commission deduction automation

### 📊 Analytics & Reporting
- Sales trends and performance metrics
- Top products and customer insights
- Revenue breakdown by payment method
- Exportable reports

### 🤖 WhatsApp Bot Integration
- Customer conversation management
- Product search and discovery
- Shopping cart functionality
- Order tracking and support

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL with RLS)
- **Auth**: JWT + Supabase Auth
- **File Storage**: Cloudflare R2
- **Payments**: Razorpay API
- **OTP**: Twilio
- **Caching**: Node-cache (can be upgraded to Redis)

### Frontend
- **Framework**: React 18
- **UI**: TailwindCSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Notifications**: React Hot Toast
- **Forms**: React Hook Form + Zod

## Security Features

- **Multi-tenant Isolation**: Row-Level Security (RLS) policies
- **Authentication**: JWT with tenant_id in app_metadata
- **Encryption**: Supabase Vault for sensitive data
- **Webhook Verification**: HMAC-SHA256 signature verification
- **Image Security**: Signed URLs with 7-day expiry
- **Access Control**: Role-based permissions

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Cloudflare R2 account
- Razorpay account
- Twilio account (for OTP)

### Backend Setup

1. Clone and navigate to backend:
```bash
cd backend
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Fill in environment variables:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key
R2_ENDPOINT=your_r2_endpoint
R2_ACCESS_KEY=your_r2_key
RAZORPAY_KEY_ID=your_razorpay_key
TWILIO_ACCOUNT_SID=your_twilio_sid
```

4. Run database migrations:
```bash
npm run migrate
```

5. Start development server:
```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend and install:
```bash
cd frontend
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update API URL if necessary:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start development server:
```bash
npm start
```

App runs on `http://localhost:3000`

## API Documentation

### Authentication Endpoints
- `POST /api/auth/signup-with-otp` - Send OTP for signup
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/set-password` - Set account password
- `POST /api/auth/login` - Login with phone and password
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/me` - Get current user profile

### Product Endpoints
- `GET /api/admin/products` - List products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `POST /api/admin/products/:id/variants` - Add variant
- `POST /api/admin/products/:id/adjust-inventory` - Adjust inventory

### Order Endpoints
- `GET /api/admin/orders` - List orders
- `GET /api/admin/orders/:id` - Get order details
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/orders/:id/invoice` - Generate invoice
- `POST /api/admin/orders/:id/return-request` - Create return request

### Payment Endpoints
- `GET /api/admin/payments` - List payments
- `GET /api/admin/payments/settlements` - Get settlements
- `POST /api/admin/payments/:id/refund` - Process refund

### Analytics Endpoints
- `GET /api/admin/analytics/summary` - Dashboard summary
- `GET /api/admin/analytics/sales-trend` - Sales trends
- `GET /api/admin/analytics/top-products` - Top products

## Database Schema

The database uses a **schema-per-tenant** model for multi-tenant isolation:

- **Public Schema**: Tenants, admin users, KYC documents, settings
- **Tenant Schemas**: Each merchant gets `tenant_abc123` schema
- **Row-Level Security**: All queries automatically filtered by tenant_id

## Deployment

### Docker

```bash
# Build
docker build -t whatsapp-bot-backend ./backend
docker build -t whatsapp-bot-frontend ./frontend

# Run
docker run -p 5000:5000 whatsapp-bot-backend
docker run -p 3000:3000 whatsapp-bot-frontend
```

### Environment Setup

Required environment variables for production:
- Node.js environment variables in backend `.env`
- React environment variables in frontend `.env`
- Database migrations applied
- Webhook URLs configured in Razorpay and WhatsApp

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Contributing

1. Create a feature branch
2. Make changes
3. Run tests
4. Submit pull request

## License

ISC

## Support

For issues and questions, please create an issue in the repository.
