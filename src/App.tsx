import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignInPage from "./components/pages/SignInPage";
import SignUpPage from "./components/pages/SignUpPage";
import ForgotPasswordPage from "./components/pages/ForgotPasswordPage";

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="*" element={<Navigate to="/signin" />} />
    </Routes>
  </BrowserRouter>
);

export default App;