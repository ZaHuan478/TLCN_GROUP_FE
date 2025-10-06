import React, { useState } from "react";
import { Input } from "../../atoms/Input/Input";
import { Button } from "../../atoms/Button/Button";
import { Toast } from "../ToastNotification";

interface ResetPasswordModalProps {
    username: string;
    onSuccess: () => void;
    onClose: () => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ username, onSuccess, onClose }) => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!newPassword.trim() || !confirmNewPassword.trim()) {
            setToast({ message: 'Vui lòng nhập đầy đủ thông tin', type: 'error' });
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setToast({ message: 'Mật khẩu xác nhận không khớp', type: 'error' });
            return;
        }

        if (newPassword.length < 6) {
            setToast({ message: 'Mật khẩu phải có ít nhất 6 ký tự', type: 'error' });
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    username, 
                    newPassword, 
                    confirmNewPassword 
                }),
            });

            const data = await response.json();
            
            if (response.ok) {
                setToast({ message: 'Đổi mật khẩu thành công!', type: 'success' });
                setTimeout(() => {
                    onSuccess();
                }, 1500); 
            } else {
                setToast({ message: data.message || 'Có lỗi xảy ra khi đổi mật khẩu', type: 'error' });
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
                    <h2 className="text-2xl font-bold mb-4">Đặt lại mật khẩu</h2>
                    <p className="mb-6 text-gray-500">
                        Nhập mật khẩu mới cho tài khoản <strong>{username}</strong>
                    </p>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <Input
                                type="password"
                                placeholder="Mật khẩu mới"
                                required
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                minLength={6}
                            />
                        </div>
                        
                        <div className="mb-6">
                            <Input
                                type="password"
                                placeholder="Xác nhận mật khẩu mới"
                                required
                                value={confirmNewPassword}
                                onChange={e => setConfirmNewPassword(e.target.value)}
                                minLength={6}
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
                                {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Toast trong modal */}
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