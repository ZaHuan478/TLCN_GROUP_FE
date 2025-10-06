import React, { useState } from "react";
import { Input } from "../../atoms/Input/Input";
import { Button } from "../../atoms/Button/Button";
import { Link } from "react-router-dom";
import { OTPModal } from "../../molecules/OTPModal";
import { ResetPasswordModal } from "../../molecules/ResetPasswordModal";
import { Toast } from "../../molecules/ToastNotification";

export const ForgotPasswordForm: React.FC = () => {
    const [username, setUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) return;

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/auth/verify-username', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            });

            const data = await response.json();

            if (response.ok) {
                setShowOTPModal(true);
                setToast({ message: 'OTP code sent!', type: 'success' });
            } else {
                setToast({ message: data.message || 'This account was not found.', type: 'error' });
            }
        } catch (error) {
           setToast({ message: 'Unable to connect to server', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOTPSuccess = () => {
        setShowOTPModal(false);
        setShowResetModal(true);
    }

    const handleResetSuccess = () => {
        setShowResetModal(false);
        setUsername("");
        alert('Password reset successful! Please log in with your new password.');
    }

    return (
        <>
            <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-lg shadow">
                <h2 className="text-3xl font-bold mb-4">Forgot Password</h2>
                <p className="mb-8 text-gray-500">
                    Enter your username below and we’ll send you code on how to reset your password.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <Input
                            type="text"
                            name="username"
                            placeholder="Username"
                            required
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full h-12 bg-black text-white hover:bg-blue-700 rounded-[6px] text-lg"
                        disabled={isLoading}
                    >
                        {isLoading ? "Sending..." : "Send"}
                    </Button>
                </form>
                <Link to="/signin" className="block mt-6 text-black hover:text-blue-600 font-medium">
                    Back to Login
                </Link>
            </div>

            {showOTPModal && (
                <OTPModal
                    username={username}
                    onSuccess={handleOTPSuccess}
                    onClose={() => setShowOTPModal(false)}
                />
            )}

            {showResetModal && (
                <ResetPasswordModal
                    username={username}
                    onSuccess={handleResetSuccess}
                    onClose={() => setShowResetModal(false)}
                />
            )}

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
};
