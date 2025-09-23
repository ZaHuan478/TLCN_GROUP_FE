import React , { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export const OAuthSuccessPage: React.FC = () => {
    const navigate = useNavigate();
    const { refreshUser } = useAuth();

    useEffect(() => {
        const handleOAuthSuccess = async () => {
            try {
                await refreshUser();

                setTimeout(() => {
                    navigate('/', {replace: true});
                }, 2000);
            } catch (error) {
                console.log('OAuth success handling error:', error);
                navigate('/signin?error=oauth_failed', { replace: true });
            }
        };

        handleOAuthSuccess();
    }, [navigate, refreshUser]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow text-center">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Đăng nhập thành công!</h2>
            <p className="text-gray-600 mb-4">
              Bạn đã đăng nhập thành công với Google. Đang chuyển hướng...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
    );
}; 