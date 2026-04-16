import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/sonner';

// i18n
import './i18n';

// Stores
import useAuthStore from './store/authStore';
import useSettingsStore from './store/settingsStore';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewAudit from './pages/NewAudit';
import AuditDetail from './pages/AuditDetail';
import AuditsList from './pages/AuditsList';
import Report from './pages/Report';
import Settings from './pages/Settings';
import Archives from './pages/Archives';
import LegalPage from './pages/LegalPage';

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0F14] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (redirects to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0F14] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const { checkAuth } = useAuthStore();
  const { initTheme } = useSettingsStore();

  useEffect(() => {
    initTheme();
    checkAuth();
  }, [checkAuth, initTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={<Landing />} 
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route path="/privacy" element={<LegalPage type="privacy" />} />
          <Route path="/terms" element={<LegalPage type="terms" />} />

          {/* Protected Routes with Dashboard Layout */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/audit/new" element={<NewAudit />} />
            <Route path="/audit/:auditId" element={<AuditDetail />} />
            <Route path="/audits" element={<AuditsList />} />
            <Route path="/report/:auditId" element={<Report />} />
            <Route path="/reports" element={<AuditsList />} />
            <Route path="/archives" element={<Archives />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Catch all - redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#13161D',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
