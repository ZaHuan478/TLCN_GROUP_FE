import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignInPage from "../../components/pages/SignInPage";
import SignUpPage from "../../components/pages/SignUpPage";
import ForgotPasswordPage from "../../components/pages/ForgotPasswordPage";
import { OAuthSuccessPage } from "../../components/pages/OAuthSuccessPage";
import { useAuth } from "../../contexts/AuthContext";
import BlogPage from "../../components/pages/BlogPage";
import SourcePage from "../../components/pages/Source/SourcePage";
import { AdminRoute } from "../../components/molecules/AdminRoute";
import { AdminDashboard, StudentManagement, CompanyManagement, BlogManagement } from "../../components/pages/Admin";
import { Unauthorized } from "../../components/pages/Unauthorized/Unauthorized";
import CareerPathsPage from "../../components/pages/CareerPaths/CareerPaths";
import CoursesPage from "../../components/pages/CoursesPage";

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/profile" element={<CareerPathsPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/settings" element={<CareerPathsPage />} />
      <Route path="/career-paths" element={<CareerPathsPage />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/oath-success" element={<OAuthSuccessPage />} />
      <Route path="/" element={<BlogPage />} />
      <Route path="/source" element={<SourcePage />} />

      {/* Admin-only routes */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="blogs" element={<BlogManagement />} />
        <Route path="students" element={<StudentManagement />} />
        <Route path="companies" element={<CompanyManagement />} />
      </Route>

      {/* Unauthorized page */}
      <Route path="/unauthorized" element={<Unauthorized />} />

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
