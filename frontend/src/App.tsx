import type { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import AdminDashboard from './pages/AdminDashboard';
import Transactions from './pages/Transactions';
import Wallets from './pages/Wallets';
import Categories from './pages/Categories';
import Bills from './pages/Bills';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Billing from './pages/Billing';
import AdminChat from './pages/AdminChat';
import LiveChat from './components/ui/LiveChat';

// A simple wrapper to protect routes
function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AdminProtectedRoute({ children }: { children: ReactNode }) {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) {
    return <Navigate to="/" replace />;
  }
  
  try {
    const user = JSON.parse(userStr);
    if (user.role !== 'super_admin') {
      return <Navigate to="/dashboard" replace />;
    }
  } catch (e) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <LiveChat />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          
          {/* Protected Routes inside Layout */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/wallets" element={<Wallets />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/bills" element={<Bills />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/billing" element={<Billing />} />
                    <Route path="/admin-chat" element={<AdminChat />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/*"
            element={
              <AdminProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                  </Routes>
                </Layout>
              </AdminProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
