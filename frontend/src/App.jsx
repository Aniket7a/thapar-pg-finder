import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CompareProvider } from './context/CompareContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RentCalculatorModal from './components/RentCalculatorModal';
import MoveInChecklistModal from './components/MoveInChecklistModal';

// Pages
import HomePage from './pages/HomePage';
import ExplorePropertiesPage from './pages/ExplorePropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import ComparePage from './pages/ComparePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MessagesPage from './pages/MessagesPage';

// Student Pages
import StudentDashboardPage from './pages/student/StudentDashboardPage';
import StudentBookingsPage from './pages/student/StudentBookingsPage';
import StudentAgreementsPage from './pages/student/StudentAgreementsPage';
import StudentFavoritesPage from './pages/student/StudentFavoritesPage';

// Owner Pages
import OwnerDashboardPage from './pages/owner/OwnerDashboardPage';
import OwnerAddPropertyPage from './pages/owner/OwnerAddPropertyPage';
import OwnerPropertiesPage from './pages/owner/OwnerPropertiesPage';
import OwnerBookingsPage from './pages/owner/OwnerBookingsPage';

// Admin Page
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

// Role-based route guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="p-20 text-center text-slate-400">Authenticating...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppContent = () => {
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar
        onOpenCalculator={() => setCalculatorOpen(true)}
        onOpenChecklist={() => setChecklistOpen(true)}
      />

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<ExplorePropertiesPage />} />
          <Route path="/properties/:id" element={<PropertyDetailPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Student Protected Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/bookings"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/agreements"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentAgreementsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/favorites"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentFavoritesPage />
              </ProtectedRoute>
            }
          />

          {/* Owner Protected Routes */}
          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute allowedRoles={['owner', 'admin']}>
                <OwnerDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/add-property"
            element={
              <ProtectedRoute allowedRoles={['owner', 'admin']}>
                <OwnerAddPropertyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/properties"
            element={
              <ProtectedRoute allowedRoles={['owner', 'admin']}>
                <OwnerPropertiesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/bookings"
            element={
              <ProtectedRoute allowedRoles={['owner', 'admin']}>
                <OwnerBookingsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Messaging */}
          <Route
            path="/messages"
            element={
              <ProtectedRoute allowedRoles={['student', 'owner', 'admin']}>
                <MessagesPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* Interactive Global Modals */}
      <RentCalculatorModal
        isOpen={calculatorOpen}
        onClose={() => setCalculatorOpen(false)}
      />
      <MoveInChecklistModal
        isOpen={checklistOpen}
        onClose={() => setChecklistOpen(false)}
      />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CompareProvider>
          <AppContent />
        </CompareProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
