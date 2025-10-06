import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignInPage from "../../components/pages/SignInPage";
import SignUpPage from "../../components/pages/SignUpPage";
import ForgotPasswordPage from "../../components/pages/ForgotPasswordPage";
import { OAuthSuccessPage } from "../../components/pages/OAuthSuccessPage";
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
      <Route path="/" element={<Homepage />} />

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
