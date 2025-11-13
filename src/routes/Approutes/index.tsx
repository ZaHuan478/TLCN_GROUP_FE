import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignInPage from "../../components/pages/SignInPage";
import SignUpPage from "../../components/pages/SignUpPage";
import ForgotPasswordPage from "../../components/pages/ForgotPasswordPage";
import { OAuthSuccessPage } from "../../components/pages/OAuthSuccessPage";
import { useAuth } from "../../contexts/AuthContext";
import BlogPage from "../../components/pages/BlogPage";
import ProfilePage from "../../components/pages/Profile/Profile";
import SettingsPage from "../../components/pages/Setting/Settings";

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/oath-success" element={<OAuthSuccessPage />} />
      <Route path="/" element={<BlogPage />} />

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
