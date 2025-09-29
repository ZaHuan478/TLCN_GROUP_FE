import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLoginButton } from "../../molecules/GoogleLoginButton";
import { Input } from "../../atoms/Input/Input";
import { Button } from "../../atoms/Button/Button";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { authService } from "../../../services/authService";
import RoleSelectionModal from "../../molecules/RoleSelectionModal/RoleSelectionModal";

export const SignUpForm: React.FC = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [pendingCredentials, setPendingCredentials] = useState<typeof formData | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const { register, refreshUser } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
    if (success) setSuccess("");
  };

  const validateForm = (): string | null => {
    if (!formData.userName.trim()) return "Vui lòng nhập tên người dùng";
    if (!formData.email.trim()) return "Vui lòng nhập email";
    if (!formData.password) return "Vui lòng nhập mật khẩu";
    if (formData.password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
    if (formData.password !== formData.confirmPassword) return "Mật khẩu xác nhận không khớp";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return "Email không hợp lệ";

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setPendingCredentials({
      userName: formData.userName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });
    setShowRoleModal(true);
  };

  const handleGoogleLogin = () => {
    authService.initiateGoogleLogin();
  };

  const handleRoleSelection = async (role: string) => {
    if (!pendingCredentials) {
      setError("Không tìm thấy thông tin người dùng. Vui lòng thử lại.");
      setShowRoleModal(false);
      return;
    }

    try {
      setIsLoading(true);
      const roleMapping: Record<string, "STUDENT" | "COMPANY" | "ADMIN"> = {
        student: "STUDENT",
        company: "COMPANY",
        admin: "ADMIN",
      };
      const backendRole = roleMapping[role] || "STUDENT";

      await register({
        ...pendingCredentials,
        role: backendRole,
      });

      authService.clearSession();
      await refreshUser();

      setSuccess("Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...");
      setShowRoleModal(false);
      setPendingCredentials(null);

      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Không thể hoàn tất đăng ký. Vui lòng thử lại.";
      setError(errorMessage);
      setShowRoleModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseRoleModal = () => {
    setShowRoleModal(false);
    setPendingCredentials(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-lg shadow relative">
        {/* Close button to return to homepage */}
        <button 
          onClick={() => navigate('/')}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-1">Welcome</h2>
        <p className="mb-6 text-gray-500">Welcome! Please enter your details.</p>
        
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

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input 
              type="text" 
              name="userName" 
              placeholder="UserName" 
              value={formData.userName}
              onChange={handleInputChange}
              required 
            />
          </div>
          <div className="mb-4">
            <Input 
              type="email" 
              name="email" 
              placeholder="Email" 
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
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
          <div className="mb-4">
            <Input 
              isPassword 
              type="password" 
              name="confirmPassword" 
              placeholder="Confirm Password" 
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required 
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-12 bg-black text-white hover:bg-blue-500 rounded-[6px]"
          >
            {isLoading ? "Sign Up ..." : "Sign up"}
          </Button>
        </form>
        
        <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <Link to="/signin" className="text-black font-medium hover:text-blue-600">
            Sign in
          </Link>
        </p>
      </div>
      
      {/* Role Selection Modal */}
      <RoleSelectionModal
        isOpen={showRoleModal}
        onSelectRole={handleRoleSelection}
        onClose={handleCloseRoleModal}
      />
    </div>
  );
};