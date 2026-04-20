# Frontend Documentation

## Overview

The frontend is a React-based Single Page Application (SPA) that serves as the admin dashboard for WhatsApp Bot merchants. It provides interfaces for:
- Merchant authentication with OTP
- Onboarding and KYC verification
- Product and inventory management
- Order tracking and fulfillment
- Payment tracking and settlements
- Analytics and reporting
- Team and settings management

## Architecture

### Technology Stack
- **Framework**: React 18
- **Routing**: React Router v6
- **State Management**: Zustand (lightweight alternative to Redux)
- **HTTP Client**: Axios with interceptors
- **Styling**: TailwindCSS
- **UI Components**: Headless UI + Heroicons
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

### Folder Structure

```
frontend/
├── public/
│   └── index.html              # Main HTML entry point
│
├── src/
│   ├── pages/                  # Page components
│   │   ├── auth/
│   │   │   ├── LoginPage.js
│   │   │   ├── SignupPage.js
│   │   │   ├── VerifyOtpPage.js
│   │   │   └── SetPasswordPage.js
│   │   ├── onboarding/
│   │   │   └── OnboardingPage.js
│   │   ├── dashboard/
│   │   │   └── DashboardPage.js
│   │   ├── products/
│   │   │   ├── ProductsPage.js
│   │   │   ├── ProductFormPage.js
│   │   │   └── InventoryPage.js
│   │   ├── orders/
│   │   │   ├── OrdersPage.js
│   │   │   ├── OrderDetailPage.js
│   │   │   └── ReturnsPage.js
│   │   ├── payments/
│   │   │   ├── PaymentsPage.js
│   │   │   ├── DisputesPage.js
│   │   │   └── SettlementsPage.js
│   │   ├── analytics/
│   │   │   └── AnalyticsPage.js
│   │   └── settings/
│   │       ├── SettingsPage.js
│   │       └── ProfilePage.js
│   │
│   ├── components/             # Reusable components
│   │   ├── DashboardLayout.js  # Main layout wrapper
│   │   ├── Sidebar.js
│   │   ├── TopBar.js
│   │   ├── Forms/
│   │   ├── Tables/
│   │   ├── Cards/
│   │   └── Charts/
│   │
│   ├── api/                    # API client
│   │   └── client.js          # Axios instance + all endpoints
│   │
│   ├── store/                  # State management
│   │   └── authStore.js        # Zustand auth store
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useFetch.js
│   │   └── useForm.js
│   │
│   ├── utils/                  # Utility functions
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── helpers.js
│   │
│   ├── styles/                 # CSS files
│   │   ├── globals.css
│   │   └── tailwind.css
│   │
│   ├── App.js                  # Root component with routing
│   ├── index.js                # React entry point
│   └── index.css               # Global styles
│
├── .env.example                # Environment variables
├── .gitignore
├── package.json
├── tailwind.config.js          # TailwindCSS configuration
├── postcss.config.js           # PostCSS configuration
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend running on http://localhost:5000

### Installation Steps

1. **Install dependencies**:
```bash
npm install
```

2. **Environment Setup**:
```bash
cp .env.example .env
```

3. **Configure environment**:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

4. **Start Development Server**:
```bash
npm start
```

Server runs on `http://localhost:3000`

5. **Build for Production**:
```bash
npm run build
```

## Application Structure

### Authentication Flow

1. **Login Page** (`/login`)
   - Phone number input
   - Password input
   - Login button
   - Link to signup

2. **Signup Page** (`/signup`)
   - Phone number input
   - Business name input
   - Email input
   - Send OTP button

3. **Verify OTP Page** (`/verify-otp`)
   - 6-digit OTP input
   - Verify button
   - Resend OTP link

4. **Set Password Page** (`/set-password`)
   - Password input
   - Confirm password input
   - Create account button

### Protected Routes

Once authenticated, user can access:

1. **Dashboard** (`/dashboard`)
   - Summary statistics
   - Recent orders
   - Quick action buttons

2. **Products** (`/products`)
   - Product list with filtering
   - Create product form
   - Edit product form
   - Inventory management

3. **Orders** (`/orders`)
   - Orders list with status filtering
   - Order details view
   - Status update capability
   - Invoice generation

4. **Payments** (`/payments`)
   - Payment history
   - Settlement details
   - Refund processing
   - Payment status tracking

5. **Analytics** (`/analytics`)
   - Sales trends chart
   - Top products list
   - Revenue metrics
   - Report export

6. **Settings** (`/settings`)
   - Profile information
   - Security settings
   - Integration configuration
   - Business policies

## State Management (Zustand)

Authentication state is managed using Zustand store:

```javascript
// useAuthStore.js
export const useAuthStore = create((set) => ({
  user: null,
  accessToken: localStorage.getItem('access_token'),
  isAuthenticated: !!localStorage.getItem('access_token'),
  isLoading: false,
  error: null,

  login: async (phone, password) => { ... },
  logout: async () => { ... },
  signupWithOtp: async (phone, business_name, email) => { ... },
  // ... other methods
}));
```

Usage in components:
```javascript
const { user, logout, isLoading } = useAuthStore();
```

## API Client (Axios)

The API client (`api/client.js`) provides:

1. **Configured Axios Instance**
   - Base URL from environment
   - Default timeout of 30 seconds
   - CORS with credentials

2. **Request Interceptor**
   - Adds JWT token to Authorization header
   - Attaches tenant_id if available

3. **Response Interceptor**
   - Handles 401 errors (token refresh)
   - Redirects to login on auth failure
   - Consistent error handling

4. **API Endpoints**
   - `authAPI.*` - All auth endpoints
   - `productsAPI.*` - All product endpoints
   - `ordersAPI.*` - All order endpoints
   - `paymentsAPI.*` - All payment endpoints
   - `analyticsAPI.*` - All analytics endpoints
   - `settingsAPI.*` - All settings endpoints

Example usage:
```javascript
const response = await productsAPI.list({ limit: 50 });
```

## UI Components

### Pages

Each page component follows a standard structure:
- Page title and description
- Loading state handling
- Error state handling
- Main content area with TailwindCSS styling

Example page structure:
```javascript
const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert error={error} />;
  
  return (
    <div>
      {/* Page content */}
    </div>
  );
};
```

### DashboardLayout

Main layout component providing:
- Collapsible sidebar with navigation
- Top header bar with user info
- Main content area
- Logout functionality

```javascript
<DashboardLayout>
  {/* Page content */}
</DashboardLayout>
```

### TailwindCSS Classes

- `.card` - Basic card container
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.form-input` - Input field styling
- `.badge` - Badge component
- `.badge-success` - Success badge
- And more utility classes

## Forms & Validation

Using React Hook Form + Zod:

```javascript
const ProductForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
    </form>
  );
};
```

## Responsive Design

- Mobile-first approach
- Breakpoints: sm, md, lg, xl, 2xl
- Grid layouts for multi-column displays
- Hamburger menu for mobile navigation

## Error Handling

1. **API Errors**: Handled by Axios interceptors
2. **Validation Errors**: Handled by Zod schemas
3. **UI Errors**: Displayed via toast notifications
4. **Route Errors**: 404 page redirects to dashboard

## Performance Optimization

1. **Code Splitting**: React Router v6 with lazy loading
2. **Memoization**: useMemo for expensive computations
3. **Image Optimization**: Next.js Image-like component (can add)
4. **Bundle Size**: TailwindCSS with PurgeCSS configured

## Debugging

### Console Logging
Development environment has verbose logging:
- API requests and responses
- State changes
- Component lifecycle events

### Redux DevTools
Can be integrated with Zustand if needed:
```javascript
import { devtools } from 'zustand/middleware';
```

### React Developer Tools
Chrome extension for React component inspection

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run single test file
npm test LoginPage.test.js

# Run in watch mode
npm test -- --watch
```

### Test Examples

```javascript
describe('LoginPage', () => {
  test('renders login form', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText(/phone/i)).toBeInTheDocument();
  });

  test('submits form with correct data', async () => {
    render(<LoginPage />);
    // ... test logic
  });
});
```

## Deployment

### Build
```bash
npm run build
```

Creates optimized build in `build/` directory.

### Deployment Options

1. **Vercel** (Easiest for Next.js, works with CRA)
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Netlify**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=build
   ```

3. **Docker**
   ```bash
   docker build -t whatsapp-bot-frontend .
   docker run -p 3000:3000 whatsapp-bot-frontend
   ```

4. **Traditional Hosting** (AWS S3 + CloudFront, etc.)
   - Copy contents of `build/` to web server
   - Configure server to serve `index.html` for routes
   - Set cache headers appropriately

### Environment for Production
```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_ENV=production
```

## Performance Metrics

- **Lighthouse**: Target 90+ scores
- **Bundle Size**: <200KB gzipped
- **Time to Interactive**: <3s on 4G
- **First Contentful Paint**: <1.5s

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile: iOS Safari 12+, Chrome Android

## Accessibility (a11y)

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast compliance (WCAG AA)

## SEO Considerations

- Meta tags in public/index.html
- Page titles dynamically updated
- Structured data (JSON-LD) for rich snippets

## Common Issues & Solutions

### Issue: "Cannot POST /api/auth/login"
**Solution**: Ensure backend is running on http://localhost:5000

### Issue: "CORS error"
**Solution**: Check CORS_ORIGIN in backend .env matches frontend URL

### Issue: "Blank page after login"
**Solution**: Check if JWT token is being stored in localStorage

### Issue: "Form not submitting"
**Solution**: Ensure React Hook Form is properly configured

## Development Workflow

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes
3. Test locally: `npm test`
4. Commit changes: `git commit -m "Add feature"`
5. Push and create PR
6. Merge after review

## Code Style

- ESLint configured for consistent code
- Prettier for code formatting
- 2-space indentation
- Single quotes for strings
- Semicolons required

To auto-format:
```bash
npm run format
```

## Build Optimization

- Tree shaking for unused code removal
- Code splitting for route chunks
- Image optimization
- CSS purging with TailwindCSS
- Minification and compression

## Monitoring

### Sentry Integration (Optional)
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your_sentry_dsn",
  environment: process.env.REACT_APP_ENV,
});
```

### Google Analytics (Optional)
```javascript
import ReactGA from 'react-ga';

ReactGA.initialize('GA_MEASUREMENT_ID');
```

## Future Enhancements

- [ ] Dark mode support
- [ ] Real-time notifications with WebSocket
- [ ] Bulk operations (CSV export/import)
- [ ] Advanced search and filtering
- [ ] Multi-language support (i18n)
- [ ] Progressive Web App (PWA)
- [ ] Offline mode for critical features
- [ ] Advanced analytics with graphs
- [ ] Mobile app (React Native)

## Support & Troubleshooting

For issues:
1. Check console for errors
2. Verify network tab in DevTools
3. Check backend logs
4. Verify environment variables
5. Clear localStorage and try again
