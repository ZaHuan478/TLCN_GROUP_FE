import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignInPage from "../../components/pages/SignInPage";
import SignUpPage from "../../components/pages/SignUpPage";
import ForgotPasswordPage from "../../components/pages/ForgotPasswordPage";
import { OAuthSuccessPage } from "../../components/pages/OAuthSuccessPage";
import { RoleSelectionPage } from "../../components/pages/RoleSelectionPage";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { useAuth } from "../../contexts/AuthContext";
import Homepage from "../../pages/Homepage";

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/oath-success" element={<OAuthSuccessPage />} />
      <Route path="/role-selection" element={<RoleSelectionPage />} />
      <Route path="/" element={<Homepage />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Dashboard</h1>
                <p className="text-gray-600">This is a protected dashboard page.</p>
              </div>
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute requiredRole="STUDENT">
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Student Dashboard
                </h1>
                <p className="text-gray-600">This page is only for students.</p>
              </div>
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/company-dashboard"
        element={
          <ProtectedRoute requiredRole="COMPANY">
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Company Dashboard
                </h1>
                <p className="text-gray-600">This page is only for companies.</p>
              </div>
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">This page is only for administrators.</p>
              </div>
            </div>
          </ProtectedRoute>
        }
      />

      {/* Catch-all route */}
      <Route
        path="*"
        element={
          isAuthenticated ? (
            <Navigate to="/" replace />
          ) : (
            <Navigate to="/signin" replace />
          )
        }
      />
    </Routes>
  );
};

export default AppRoutes;
