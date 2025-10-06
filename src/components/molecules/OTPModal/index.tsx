import React, { useState } from "react";
import { Input } from "../../atoms/Input/Input";
import { Button } from "../../atoms/Button/Button";
import { Toast } from "../ToastNotification"; // Import Toast

interface OTPModalProps {
    username: string;
    onSuccess: () => void;
    onClose: () => void;
}

export const OTPModal: React.FC<OTPModalProps> = ({ username, onSuccess, onClose }) => {
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp.trim()) {
            setToast({ message: 'Vui lòng nhập mã OTP', type: 'error' });
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/auth/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, otp }),
            });

            const data = await response.json();
            
            if (response.ok) {
                setToast({ message: 'Xác thực OTP thành công!', type: 'success' });
                setTimeout(() => {
                    onSuccess();
                }, 1000); // Delay để hiển thị toast
            } else {
                setToast({ message: data.message || 'Mã OTP không đúng', type: 'error' });
            }
        } catch (error) {
            setToast({ message: 'Không thể kết nối đến server', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                    <h2 className="text-2xl font-bold mb-4">Nhập mã OTP</h2>
                    <p className="mb-6 text-gray-500">
                        Chúng tôi đã gửi mã OTP đến tài khoản của bạn. Vui lòng nhập mã để xác thực.
                    </p>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <Input
                                type="text"
                                placeholder="Nhập mã OTP"
                                required
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                                maxLength={6}
                            />
                        </div>
                        
                        <div className="flex gap-4">
                            <Button
                                type="button"
                                onClick={onClose}
                                className="flex-1 h-12 bg-gray-300 text-gray-700 hover:bg-gray-400 rounded-[6px]"
                                disabled={isLoading}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 h-12 bg-black text-white hover:bg-blue-700 rounded-[6px] disabled:opacity-50"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Đang xác thực...' : 'Xác thực'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
            
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