import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

// Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import VerifyOtpPage from './pages/auth/VerifyOtpPage';
import SetPasswordPage from './pages/auth/SetPasswordPage';
import OnboardingPage from './pages/onboarding/OnboardingPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProductsPage from './pages/products/ProductsPage';
import OrdersPage from './pages/orders/OrdersPage';
import PaymentsPage from './pages/payments/PaymentsPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import SettingsPage from './pages/settings/SettingsPage';

// Protected Route Component
const ProtectedRoute = ({ component }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return component;
};

// Public Route Component (redirect to dashboard if authenticated)
const PublicRoute = ({ component }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return component;
};

function App() {
  const { isAuthenticated, accessToken } = useAuthStore();

  useEffect(() => {
    // Check authentication on app load
    if (accessToken) {
      // Token exists, user is authenticated
    } else {
      // No token, user is not authenticated
    }
  }, [accessToken]);

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Auth Routes */}
        <Route
          path="/login"
          element={<PublicRoute component={<LoginPage />} />}
        />
        <Route
          path="/signup"
          element={<PublicRoute component={<SignupPage />} />}
        />
        <Route
          path="/verify-otp"
          element={<PublicRoute component={<VerifyOtpPage />} />}
        />
        <Route
          path="/set-password"
          element={<PublicRoute component={<SetPasswordPage />} />}
        />

        {/* Onboarding Route */}
        <Route
          path="/onboarding"
          element={<ProtectedRoute component={<OnboardingPage />} />}
        />

        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute component={
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          } />}
        />

        <Route
          path="/products"
          element={<ProtectedRoute component={
            <DashboardLayout>
              <ProductsPage />
            </DashboardLayout>
          } />}
        />

        <Route
          path="/orders"
          element={<ProtectedRoute component={
            <DashboardLayout>
              <OrdersPage />
            </DashboardLayout>
          } />}
        />

        <Route
          path="/payments"
          element={<ProtectedRoute component={
            <DashboardLayout>
              <PaymentsPage />
            </DashboardLayout>
          } />}
        />

        <Route
          path="/analytics"
          element={<ProtectedRoute component={
            <DashboardLayout>
              <AnalyticsPage />
            </DashboardLayout>
          } />}
        />

        <Route
          path="/settings"
          element={<ProtectedRoute component={
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          } />}
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
