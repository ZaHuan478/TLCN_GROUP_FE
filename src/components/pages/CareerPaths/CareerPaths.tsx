import React, { useState, useEffect } from 'react';
import MainTemplate from '../../templates/MainTemplate/MainTemplate';
import { AddTestModal } from '../../molecules/AddTestModal';
import { Button } from '../../atoms/Button/Button';
import { ProtectedRoute } from '../../ProtectedRoute';
import StudentSettingsForm from '../../molecules/StudentSettingsForm';
import CompanySettingsForm from '../../molecules/CompanySettingsForm';
import { useAuth } from '../../../contexts/AuthContext';
import { ProfileShell } from '../../organisms/ProfileShell';
import { useLocation } from 'react-router-dom';
import { getMyCareerTests, createCareerTest, deleteCareerTest } from '../../../api/careerPathApi';
import { CareerTest } from '../../../types/types';
import { Toast } from '../../molecules/ToastNotification';

type ViewType = 'career-paths' | 'profile' | 'settings';

const CareerPathsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [loadingTests, setLoadingTests] = useState(false);

  const getDefaultView = (): ViewType => {
    if (location.pathname === '/profile') return 'profile';
    if (location.pathname === '/settings') return 'settings';
    if (location.pathname === '/career-paths') {
      return user?.role === 'COMPANY' ? 'career-paths' : 'profile';
    }
    return user?.role === 'COMPANY' ? 'career-paths' : 'profile';
  };

  const [activeView, setActiveView] = useState<ViewType>(getDefaultView());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tests, setTests] = useState<CareerTest[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  useEffect(() => {
    if (location.pathname === '/profile') {
      setActiveView('profile');
    } else if (location.pathname === '/settings') {
      setActiveView('settings');
    } else if (location.pathname === '/career-paths') {
      setActiveView(user?.role === 'COMPANY' ? 'career-paths' : 'profile');
    }
  }, [location.pathname, user?.role]);

  useEffect(() => {
    const loadTests = async () => {
      if (activeView === 'career-paths' && user?.role === 'COMPANY') {
        try {
          setLoadingTests(true);
          const data = await getMyCareerTests();
          setTests(data);
        } catch (error) {
          console.error('Failed to load career tests:', error);
          setToast({ message: 'Không thể tải danh sách bài test. Vui lòng thử lại!', type: 'error' });
        } finally {
          setLoadingTests(false);
        }
      }
    };

    loadTests();
  }, [activeView, user?.role]);

  const handleAddTest = async (data: { title: string; description: string; image: File | null }) => {
    if (user?.role !== 'COMPANY' && user?.role !== 'ADMIN') {
      setToast({ message: 'Chỉ công ty hoặc admin mới có quyền tạo career path. Vui lòng đăng nhập với tài khoản công ty.', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      const newTest = await createCareerTest({
        title: data.title,
        description: data.description,
        images: data.image,
      });
      setTests([newTest, ...tests]);
      setToast({ message: 'Tạo bài test thành công!', type: 'success' });
    } catch (error: any) {
      console.error('Failed to create career test:', error);

      if (error.response?.status === 403) {
        setToast({ message: 'Bạn không có quyền tạo career path. Chỉ công ty hoặc admin mới có quyền này.', type: 'error' });
      } else if (error.response?.status === 401) {
        setToast({ message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', type: 'error' });
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Tạo bài test thất bại. Vui lòng thử lại!';
        setToast({ message: errorMessage, type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTest = async (testId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài test này?')) return;

    try {
      await deleteCareerTest(testId);
      setTests(tests.filter(test => test.id !== testId));
      setToast({ message: 'Xóa bài test thành công!', type: 'success' });
    } catch (error) {
      console.error('Failed to delete career test:', error);
      setToast({ message: 'Xóa bài test thất bại. Vui lòng thử lại!', type: 'error' });
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'profile':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>
            <ProfileShell role={user?.role === 'COMPANY' ? 'COMPANY' : 'STUDENT'} />
          </div>
        );

      case 'settings':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-50">
              {user?.role === 'COMPANY' ? <CompanySettingsForm /> : <StudentSettingsForm />}
            </div>
          </div>
        );

      case 'career-paths':
      default:
        return (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Career Paths</h1>
                <p className="text-gray-600">Manage and create career assessment tests</p>
              </div>
              <Button
                variant="primary"
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Career Path
              </Button>
            </div>

            {loadingTests ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : tests.length === 0 ? (
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400 mb-4">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có bài test nào</h3>
                <p className="text-gray-500 mb-6">Bắt đầu bằng cách tạo bài test đánh giá nghề nghiệp đầu tiên</p>
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                  Tạo bài test đầu tiên
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests.map((test) => (
                  <div key={test.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    {test.imageUrl && (
                      <div className="h-48 bg-gray-100">
                        <img
                          src={test.imageUrl}
                          alt={test.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{test.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {test.description || 'Chưa có mô tả'}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <span>{new Date(test.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="flex-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors">
                          Xem chi tiết
                        </button>
                        <button 
                          onClick={() => handleDeleteTest(test.id)}
                          className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        );
    }
  };

  return (
    <MainTemplate>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="flex min-h-screen bg-gray-50">
        {/* Custom Sidebar */}
        <div className="w-64 flex-shrink-0 bg-white border-r border-gray-200 min-h-screen sticky top-0">
          <div className="p-6 flex flex-col min-h-screen">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Navigation</h2>

            <nav className="space-y-2 flex-1">
              <button
                onClick={() => setActiveView('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${activeView === 'profile'
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <span className={activeView === 'profile' ? 'text-blue-600' : 'text-gray-400'}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
                <span>Profile</span>
              </button>

              <button
                onClick={() => setActiveView('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${activeView === 'settings'
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <span className={activeView === 'settings' ? 'text-blue-600' : 'text-gray-400'}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"></path>
                  </svg>
                </span>
                <span>Settings</span>
              </button>

              {/* Career Paths - Only for COMPANY role */}
              {user?.role === 'COMPANY' && (
                <button
                  onClick={() => setActiveView('career-paths')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${activeView === 'career-paths'
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <span className={activeView === 'career-paths' ? 'text-blue-600' : 'text-gray-400'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                  </span>
                  <span>Career Paths</span>
                </button>
              )}
            </nav>

            {/* Logout button at bottom */}
            <div className="mt-auto pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  logout();
                  window.location.href = '/signin';
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Add Test Modal */}
      <AddTestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTest}
        loading={loading}
      />
    </MainTemplate>
  );
};

const CareerPathsPageWithProtection = () => (
  <ProtectedRoute>
    <CareerPathsPage />
  </ProtectedRoute>
);

export default CareerPathsPageWithProtection;
