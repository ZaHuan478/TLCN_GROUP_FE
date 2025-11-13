import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '../../atoms/Button/Button';

export const StudentProfileCard: React.FC = () => {
  const { user } = useAuth();

  // Fallbacks for demo when fields are missing
  const fullName = user?.fullName ?? 'Your Name';
  const studentId = user?.studentId ?? 'S1234567';
  const school = user?.companyId ? '' : 'University of Example';
  const major = 'Computer Science';
  const year = '3';
  const bio = 'A hardworking student passionate about web development and open-source.';

  const getInitials = () => {
    if (fullName) {
      const names = fullName.split(' ');
      if (names.length >= 2) {
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
      }
      return fullName.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Avatar và thông tin cơ bản */}
      <div className="flex flex-col items-center text-center pb-6 border-b border-gray-200">
        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg">
          {getInitials()}
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{fullName}</h2>
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
          </svg>
          <span className="font-medium text-gray-700">Mã SV: {studentId}</span>
        </div>
      </div>

      {/* Thông tin học tập */}
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <span className="text-sm">Trường</span>
          </div>
          <span className="font-semibold text-gray-900">{school || 'Chưa cập nhật'}</span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            <span className="text-sm">Chuyên ngành</span>
          </div>
          <span className="font-semibold text-gray-900">{major}</span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span className="text-sm">Năm học</span>
          </div>
          <span className="font-semibold text-gray-900">Năm {year}</span>
        </div>

        {bio && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mt-0.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Giới thiệu</p>
                <p className="text-sm text-gray-600 leading-relaxed">{bio}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Button */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <Link to="/settings" className="block">
          <Button variant="primary" className="w-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Chỉnh sửa hồ sơ
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default StudentProfileCard;
