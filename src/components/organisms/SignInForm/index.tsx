import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLoginButton } from "../../molecules/GoogleLoginButton";
import { Input } from "../../atoms/Input/Input";
import { Checkbox } from "../../atoms/Checkbox.tsx/Checkbox";
import { Button } from "../../atoms/Button/Button";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { authService } from "../../../services/authService";

export const SignInForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const form = location.state?.form?.pathname || "/";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(formData.username, formData.password);
      navigate(form, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || "Dang nhap that bai");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    authService.initiateGoogleLogin();
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-1">Welcome</h2>
      <p className="mb-6 text-gray-500">
        Welcome back! Please enter your details.
      </p>
      <GoogleLoginButton onClick={handleGoogleLogin} />
      <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="mx-3 text-gray-400 text-sm">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input type="text" name="username" placeholder="UserName" value={formData.username} onChange={handleInputChange} required />
        </div>
        <div className="mb-2">
          <Input
            isPassword
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center text-sm text-gray-600">
            <Checkbox  
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="mr-2"
            />
            Remember for 30 days
          </label>
          <Link to="/forgot-password"  className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700 rounded-[6px]">
          {isLoading ? "Đang đăng nhập..." : "Log in"}
        </Button>
      </form>
      <p className="mt-6 text-center text-gray-400 text-sm">
        Don't have an account?{" "}
        <Link to="/signup" className="text-black font-medium hover:text-blue-600">
          Sign up for free
        </Link>
      </p>
    </div>
  );
};
