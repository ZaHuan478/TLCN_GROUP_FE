import React from 'react';
import StudentProfileCard from '../../molecules/StudentProfileCard';
import CompanyProfileCard from '../../molecules/CompanyProfileCard';

export const ProfileShell: React.FC<{ role: 'STUDENT' | 'COMPANY' }> = ({ role }) => {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-1 bg-gradient-to-b rounded-full"></div>
            <h1 className="text-3xl font-bold text-gray-900">
              {role === 'STUDENT'}
            </h1>
          </div>
          <p className="text-gray-600 ml-4">
            {role === 'STUDENT'}
          </p>
        </div>

        {/* Profile Card */}
        <div className="transform transition-all duration-300 hover:scale-[1.01]">
          {role === 'STUDENT' ? <StudentProfileCard /> : <CompanyProfileCard />}
        </div>
      </div>
    </div>
  );
};
