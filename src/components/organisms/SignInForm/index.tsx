import React from "react";
import { GoogleLoginButton } from "../../molecules/GoogleLoginButton";
import { Input } from "../../atoms/Input/Input";
import { Checkbox } from "../../atoms/Checkbox.tsx/Checkbox";
import { Button } from "../../atoms/Button/Button";
import { Link } from "react-router-dom";

export const SignInForm: React.FC = () => {
    return (
        <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-1">Welcome</h2>
            <p className="mb-6 text-gray-500">Welcome back! Please enter your details.</p>
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
                <div className="mb-2">
                    <Input isPassword type="password" name="password" placeholder="Password" required />
                </div>
                <div className="flex items-center justify-between mb-6">
                    <label className="flex items-center text-sm text-gray-600">
                        <Checkbox className="mr-2" />
                        Remember for 30 days
                    </label>
                    <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                        Forgot password?
                    </Link>
                </div>
                <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700 rounded-[6px]">Log in</Button>
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