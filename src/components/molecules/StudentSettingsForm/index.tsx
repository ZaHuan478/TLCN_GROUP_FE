import React, { useState, useEffect } from 'react';
import { Input } from '../../atoms/Input/Input';
import { Button } from '../../atoms/Button/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { getStudentProfile, updateStudentProfile } from '../../../services/studentService';
import { StudentProfile } from '../../../types/types';
import { Toast } from '../ToastNotification';

export const StudentSettingsForm: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [major, setMajor] = useState('');
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      setIsLoadingProfile(true);
      try {
        const profile = await getStudentProfile();
        console.log('🔍 Fetched student profile:', profile);
        setStudentProfile(profile);
        setFullName(profile.fullName ?? '');
        setEmail(profile.email ?? '');
        setSchool(profile.school ?? '');
        setMajor(profile.major ?? '');
        setBio(profile.bio ?? '');
        console.log('✅ State updated - fullName:', profile.fullName, 'school:', profile.school, 'major:', profile.major);
      } catch (error) {
        console.error('Failed to load student profile', error);
        setToast({ message: 'Could not load student profile. Please try again!', type: 'error' });
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchStudentProfile();
  }, []);

  const handleSave = async () => {
    if (!fullName || fullName.trim() === '') {
      setToast({ message: 'Full name is required', type: 'warning' });
      return;
    }

    try {
      setIsSaving(true);
      const updatedProfile = await updateStudentProfile({
        fullName: fullName.trim(),
        email: email.trim(),
        school: (school ?? '').trim() || undefined,
        major: (major ?? '').trim() || undefined,
        bio: (bio ?? '').trim() || undefined,
        password: (password ?? '').trim() || undefined,
      });
      
      setStudentProfile(updatedProfile);
      setFullName(updatedProfile.fullName ?? '');
      setEmail(updatedProfile.email ?? '');
      setSchool(updatedProfile.school ?? '');
      setMajor(updatedProfile.major ?? '');
      setBio(updatedProfile.bio ?? '');
      setPassword('');
      refreshUser();
      setToast({ message: 'Student profile updated successfully!', type: 'success' });
    } catch (err) {
      console.error('Failed to update student profile', err);
      setToast({ message: 'Failed to update profile. Please try again!', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (studentProfile) {
      setFullName(studentProfile.fullName ?? '');
      setEmail(studentProfile.email ?? '');
      setSchool(studentProfile.school ?? '');
      setMajor(studentProfile.major ?? '');
      setBio(studentProfile.bio ?? '');
      setPassword('');
    } else {
      setFullName(user?.fullName ?? '');
      setEmail(user?.email ?? '');
      setSchool('');
      setMajor('');
      setBio('');
      setPassword('');
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-1">Profile Settings</h3>
        <p className="text-sm text-gray-500">Manage your personal and academic information</p>
      </div>

      {isLoadingProfile ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>

      {/* Personal Information */}
      <div className="space-y-5">
        <div className="border-b border-gray-200 pb-2">
          <h4 className="text-base font-medium text-gray-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Personal Information
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Full Name
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                placeholder="Enter your full name" 
                className="w-full pl-10" 
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              Email
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Your email address" 
                className="w-full pl-10" 
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Information */}
      <div className="space-y-5">
        <div className="border-b border-gray-200 pb-2">
          <h4 className="text-base font-medium text-gray-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            Academic Information
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                School
              </label>
              <div className="relative">
                <Input 
                  value={school} 
                  onChange={(e) => setSchool(e.target.value)} 
                  placeholder="University name" 
                  className="w-full pl-10" 
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
                Major
              </label>
              <div className="relative">
                <Input 
                  value={major} 
                  onChange={(e) => setMajor(e.target.value)} 
                  placeholder="Your major" 
                  className="w-full pl-10" 
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              Bio
            </label>
            <textarea
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="space-y-5">
        <div className="border-b border-gray-200 pb-2">
          <h4 className="text-base font-medium text-gray-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Security
          </h4>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            New Password
          </label>
          <div className="relative">
            <Input 
              isPassword 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter new password (leave blank to keep current)" 
              className="w-full pl-10" 
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <p className="text-xs text-gray-500 mt-1">Leave blank if you don't want to change your password</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <Button 
          variant="secondary" 
          onClick={handleCancel}
          className="px-6"
          disabled={isLoadingProfile || isSaving}
        >
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSave}
          className="px-6 flex items-center justify-center"
          disabled={isLoadingProfile || isSaving}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          Save Changes
        </Button>
      </div>
      </>
      )}
    </div>
  );
};

export default StudentSettingsForm;
