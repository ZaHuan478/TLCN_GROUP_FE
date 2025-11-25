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
import ConnectionsPage from "../../components/pages/Connections";
import UserProfilePage from "../../components/pages/UserProfile";
import AIChat from "../../components/pages/AIChat";

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
      <Route path="/oauth-success" element={<OAuthSuccessPage />} />
      <Route path="/" element={<BlogPage />} />
      <Route path="/connections" element={<ConnectionsPage />} />
      <Route path="/users/:id" element={<UserProfilePage />} />
      <Route path="/ai-chat" element={<AIChat />} />

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
