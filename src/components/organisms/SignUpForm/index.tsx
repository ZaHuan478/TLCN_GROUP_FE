import React from "react";
import { GoogleLoginButton } from "../../molecules/GoogleLoginButton";
import { Input } from "../../atoms/Input/Input";
import { Checkbox } from "../../atoms/Checkbox.tsx/Checkbox";
import { Button } from "../../atoms/Button/Button";
import { Link } from "react-router-dom";

export const SignUpForm: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-1">Welcome</h2>
      <p className="mb-6 text-gray-500">Welcome back! Pleaase enter your details.</p>
      <GoogleLoginButton />
      <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="mx-3 text-gray-400 text-sm">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <form>
        <div className="mb-4">
          <Input type="text" name="name" placeholder="UserName" required />
        </div>
        <div className="mb-4">
          <Input type="email" name="email" placeholder="Email" required></Input>
        </div>
        <div className="mb-4">
          <Input isPassword type="password" name="password" placeholder="Password" required />
        </div>
        <div className="mb-4">
          <Input isPassword type="password" name="password" placeholder="ConfirmPassword" required />
        </div>
        <Button type="submit" className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700 rounded-[6px]">Sign up</Button>
      </form>
      <p className="mt-6 text-center text-gray-400 text-sm">
        Already have an account?{" "}
        <Link to="/signin" className="text-black font-medium hover:text-blue-600">
          Sign in
        </Link>
      </p>
    </div>
  </div>
);