import React from 'react';
import { Avatar } from '../../atoms/Avatar';
import { UserStat } from '../../atoms/UserStat';
import { Button } from '../../atoms/Button/Button';

type UserWallHeaderProps = {
  userId: string;
  name: string;
  role: string;
  avatar?: string;
  coverColor?: string;
  type: 'student' | 'company';
  stats: {
    courses?: number;
    followers?: number;
    points?: number;
  };
  isOwnProfile: boolean;
  onFollowClick?: () => void;
  onAvatarChange?: (file: File) => void;
  className?: string;
};

export const UserWallHeader: React.FC<UserWallHeaderProps> = ({
  name,
  role,
  avatar,
  coverColor = 'from-blue-500 to-purple-600',
  type,
  stats,
  isOwnProfile,
  onFollowClick,
  onAvatarChange,
  className = '',
}) => {
  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onAvatarChange) {
      onAvatarChange(file);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
      {/* Cover Photo */}
      <div className={`h-64 bg-gradient-to-r ${coverColor}`}></div>

      {/* User Info Section */}
      <div className="px-8 pb-6">
        <div className="flex items-end justify-between -mt-16">
          {/* Avatar */}
          <div className="relative">
            <Avatar src={avatar} name={name} size="2xl" type={type} />
            {isOwnProfile && onAvatarChange && (
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors"
                title="Change avatar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Action Button */}
          <div className="mb-4">
            {!isOwnProfile && (
              <Button
                onClick={onFollowClick}
                variant="primary"
                className="px-6 py-2"
              >
                Follow
              </Button>
            )}
          </div>
        </div>

        {/* User Details */}
        <div className="mt-4">
          <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
          <p className="text-gray-600 mt-1">{role}</p>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-4">
            {stats.courses !== undefined && (
              <UserStat
                label="Courses"
                value={stats.courses}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                }
              />
            )}
            {stats.followers !== undefined && (
              <UserStat
                label="Followers"
                value={stats.followers}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                }
              />
            )}
            {stats.points !== undefined && (
              <UserStat
                label="Points"
                value={stats.points}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
