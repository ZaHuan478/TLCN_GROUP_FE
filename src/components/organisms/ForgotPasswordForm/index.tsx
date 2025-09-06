import React, { useState } from "react";
import { Input } from "../../atoms/Input/Input";
import { Button } from "../../atoms/Button/Button";
import { Link } from "react-router-dom";

export const ForgotPasswordForm: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
            <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-lg shadow">
                <h2 className="text-3xl font-bold mb-4">Forgot Password</h2>
                <p className="mb-8 text-gray-500">
                    Enter your phone number below and we’ll send you instructions on how to reset your password.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <Input
                            type="tel"
                            name="phone"
                            placeholder="Phone number"
                            required
                            value={phoneNumber}
                            onChange={e => setPhoneNumber(e.target.value)}
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700 rounded-[6px] text-lg"
                    >
                        Reset Password
                    </Button>
                </form>
                <Link to="/signin" className="block mt-6 text-blue-600 hover:underline font-medium">
                    Back to Login
                </Link>
            </div>
    );
};
