import React from "react";
import { AdminLayout } from "../../templates/AdminLayout/AdminLayout";
import { AdminOnly } from "../../atoms/AdminOnly/AdminOnly";
import { Button } from "../../atoms/Button/Button";
import { StatCard } from "../../atoms/StatCard/StatCard";

export const AdminDashboard: React.FC = () => {
  const stats = [
    {
      label: "Total Students",
      value: "1,234",
      change: "+12% from last month",
      positive: true,
      color: "blue" as const,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      label: "Total Companies",
      value: "89",
      change: "+5% from last month",
      positive: true,
      color: "green" as const,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      label: "Active Blog Posts",
      value: "456",
      change: "+18% from last month",
      positive: true,
      color: "purple" as const,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      label: "Pending Reviews",
      value: "23",
      change: "-3% from last month",
      positive: false,
      color: "red" as const,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back! Here's what's happening with your platform.
            </p>
          </div>
          <AdminOnly>
            <Button variant="primary" className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>New Action</span>
            </Button>
          </AdminOnly>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              label={stat.label}
              value={stat.value}
              change={stat.change}
              positive={stat.positive}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Students */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Students</h2>
              <AdminOnly>
                <Button variant="secondary" className="text-sm">View All</Button>
              </AdminOnly>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">S{i}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Student Name {i}</p>
                    <p className="text-xs text-gray-500">student{i}@example.com</p>
                  </div>
                  <span className="text-xs text-gray-500">2 days ago</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Companies */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Companies</h2>
              <AdminOnly>
                <Button variant="secondary" className="text-sm">View All</Button>
              </AdminOnly>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-sm">C{i}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Company {i}</p>
                    <p className="text-xs text-gray-500">company{i}@example.com</p>
                  </div>
                  <span className="text-xs text-gray-500">3 days ago</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Admin-Only Quick Actions */}
        <AdminOnly>
          <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl shadow-md p-6 border border-red-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Admin Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="primary" className="w-full justify-center">
                Manage Users
              </Button>
              <Button variant="primary" className="w-full justify-center">
                View Reports
              </Button>
              <Button variant="primary" className="w-full justify-center">
                System Settings
              </Button>
            </div>
          </div>
        </AdminOnly>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
