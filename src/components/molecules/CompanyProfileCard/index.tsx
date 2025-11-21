import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '../../atoms/Button/Button';
import { getCompanyProfile } from '../../../services/companyService';
import { CompanyProfile } from '../../../types/types';
import { Toast } from '../ToastNotification';

export const CompanyProfileCard: React.FC = () => {
  const { user } = useAuth();
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      setIsLoading(true);
      try {
        const profile = await getCompanyProfile();
        setCompanyProfile(profile);
      } catch (error) {
        console.error('Failed to load company profile', error);
        setToast({ message: 'Không thể tải thông tin công ty. Vui lòng thử lại!', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyProfile();
  }, []);

  const companyName = companyProfile?.companyName ?? user?.fullName ?? 'Company Name';
  const taxCode = companyProfile?.taxCode ?? '';
  const email = companyProfile?.email ?? user?.email ?? 'contact@example.com';
  const address = companyProfile?.address ?? '';
  const website = companyProfile?.website ?? '';
  const industry = companyProfile?.industry ?? '';
  const description = companyProfile?.description ?? '';

  const getInitials = () => {
    if (companyName) {
      const words = companyName.split(' ').filter(w => w.length > 0);
      if (words.length >= 2) {
        return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
      }
      return companyName.substring(0, 2).toUpperCase();
    }
    return 'CO';
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
      {/* Logo và thông tin cơ bản */}
      <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
        <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg flex-shrink-0">
          {getInitials()}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{companyName}</h2>
          {taxCode && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              <span className="font-medium">Tax ID: {taxCode}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span className="truncate">{email}</span>
          </div>
        </div>
      </div>

      {/* Thông tin chi tiết */}
      <div className="mt-6 space-y-4">
        {industry && (
          <div className="flex items-start gap-3 py-2 border-b border-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mt-0.5 flex-shrink-0">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <div className="flex-1">
              <span className="text-sm text-gray-500 block mb-1">Industry</span>
              <span className="text-sm font-semibold text-gray-900">{industry}</span>
            </div>
          </div>
        )}

        {address && (
          <div className="flex items-start gap-3 py-2 border-b border-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mt-0.5 flex-shrink-0">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <div className="flex-1">
              <span className="text-sm text-gray-500 block mb-1">Address</span>
              <span className="text-sm font-semibold text-gray-900">{address}</span>
            </div>
          </div>
        )}

        {website && (
          <div className="flex items-start gap-3 py-2 border-b border-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mt-0.5 flex-shrink-0">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <div className="flex-1">
              <span className="text-sm text-gray-500 block mb-1">Website</span>
              <a 
                href={website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline break-all"
              >
                {website}
              </a>
            </div>
          </div>
        )}

        {description && (
          <div className="pt-2">
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mt-0.5 flex-shrink-0">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 mb-1">About Company</p>
                <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Button */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <Link to="/career-paths?tab=settings" className="block">
          <Button variant="primary" className="w-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit Profile
          </Button>
        </Link>
      </div>
      </>
      )}
    </div>
  );
};

export default CompanyProfileCard;
