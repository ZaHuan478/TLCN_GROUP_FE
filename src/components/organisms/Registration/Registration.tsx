import React, { useState } from "react";
import { Input } from "../../atoms/Input/Input";
import { Button } from "../../atoms/Button/Button";
import Heading from "../../atoms/Heading/Heading";
import RoleSelectionModal from "../../molecules/RoleSelectionModal/RoleSelectionModal";
import { updateUserRole } from "../../../services/userService";
import { useNavigate } from "react-router-dom";

interface RegistrationFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Registration: React.FC = () => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate registration API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, call your registration API and get the user ID
      // const response = await registerUser(formData);
      // const newUserId = response.userId;
      
      const mockUserId = "user_" + Math.random().toString(36).substr(2, 9);
      setUserId(mockUserId);
      
      // After successful registration, show the role selection modal
      setIsModalOpen(true);
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelection = async (role: string) => {
    if (!userId) return;
    
    setIsLoading(true);
    
    try {
      // Update user role in the backend
      await updateUserRole(userId, role);
      
      // For demo purposes, store role in localStorage
      localStorage.setItem(`user_${userId}_role`, role);
      localStorage.setItem("currentUserId", userId);
      
      // Close the modal
      setIsModalOpen(false);
      
      // Redirect to profile page or dashboard
      navigate("/profile");
    } catch (error) {
      console.error("Failed to update role:", error);
      alert("Failed to set user role. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 px-4 sm:px-10 bg-white">
      <div className="max-w-md mx-auto">
        <Heading level={2} className="text-center mb-8" style={{ fontFamily: "Neurial Grotesk" }}>
          Create Your Account
        </Heading>
        
        <form onSubmit={handleRegisterSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a password"
              required
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            variant="primary" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Register"}
          </Button>
          
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Sign in
            </a>
          </p>
        </form>
      </div>
      
      {/* Role Selection Modal */}
      <RoleSelectionModal 
        isOpen={isModalOpen}
        onSelectRole={handleRoleSelection}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default Registration;
