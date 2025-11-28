import React, { useState, useEffect } from 'react';
import { Badge } from '../../atoms/Badge';
import { getEnrolledCourses } from '../../../api/studentApi';
import { courseApi } from '../../../api/courseApi';
import { ChevronDown, ChevronUp, Users } from 'lucide-react';
import { userApi } from '../../../api/userApi';
import { Button } from '../../atoms/Button/Button';

type CourseProgress = {
  id: string;
  title: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED';
  progress?: number;
  enrolledStudents?: number; // Total students enrolled in this course
};

type StudentEnrollment = {
  id: string;
  fullName: string;
  username: string;
  avatar?: string;
  progress: number;
  status: string;
};

type UserCoursesSectionProps = {
  userId?: string; // Optional: if you want to fetch for specific user
  className?: string;
  onCoursesLoaded?: (count: number) => void; // Callback to report course count
};

export const UserCoursesSection: React.FC<UserCoursesSectionProps> = ({
  userId,
  className = '',
  onCoursesLoaded,
}) => {
  const [courses, setCourses] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());
  const [courseStudents, setCourseStudents] = useState<Record<string, StudentEnrollment[]>>({});
  const [loadingStudents, setLoadingStudents] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, get user info to determine role
        let role = null;
        if (userId) {
          try {
            const userInfo = await userApi.getById(userId);
            role = userInfo.role;
            setUserRole(role);
          } catch (err) {
            console.error('Error fetching user info:', err);
          }
        }

        // Fetch courses based on role
        if (role === 'COMPANY') {
          // For companies, fetch their created courses
          const response = await courseApi.getMyCourses() as any;
          const data = response.data || response;

          console.log('🔍 Company courses API response:', response);

          // Transform company courses to match CourseProgress type
          const transformedCourses: CourseProgress[] = (data || []).map((item: any) => ({
            id: item.id || '',
            title: item.title || 'Untitled Course',
            status: item.status === 'PUBLISHED' ? 'COMPLETED' : 'IN_PROGRESS',
            progress: item.status === 'PUBLISHED' ? 100 : 50,
            enrolledStudents: item.enrolledStudents || 0,
          }));

          setCourses(transformedCourses);
          onCoursesLoaded?.(transformedCourses.length);
        } else {
          // For students, fetch enrolled courses
          const response = await getEnrolledCourses() as any;
          const data = response.data || response;

          console.log('🔍 Enrolled courses API response:', response);
          console.log('🔍 Data to transform:', data);

          // Transform API response to match CourseProgress type
          const transformedCourses: CourseProgress[] = (data.enrolledCourses || data.progress || data || []).map((item: any) => {
            console.log('🔍 Individual course item:', item);

            // API returns 'course' field, not 'careerPath'
            const courseData = item.course || item.careerPath || item;

            // Calculate progress if not provided
            let calculatedProgress = item.progress || 0;

            // If no progress field, try to calculate from completed lessons
            if (!item.progress && item.completedLessons !== undefined && item.totalLessons !== undefined && item.totalLessons > 0) {
              calculatedProgress = Math.round((item.completedLessons / item.totalLessons) * 100);
            }

            // Also check if there's a progressPercentage field
            if (!calculatedProgress && item.progressPercentage !== undefined) {
              calculatedProgress = item.progressPercentage;
            }

            return {
              id: item.careerPathId || courseData.id || item.id || '',
              title: courseData.title || item.title || 'Untitled Course',
              status: item.status || 'NOT_STARTED',
              progress: calculatedProgress,
            };
          });

          console.log('🔍 Transformed courses:', transformedCourses);

          setCourses(transformedCourses);
          onCoursesLoaded?.(transformedCourses.length);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [userId]);

  const toggleCourseExpansion = async (courseId: string) => {
    const newExpanded = new Set(expandedCourses);

    if (newExpanded.has(courseId)) {
      newExpanded.delete(courseId);
    } else {
      newExpanded.add(courseId);

      // Fetch students if not already loaded
      if (!courseStudents[courseId] && userRole === 'COMPANY') {
        setLoadingStudents(prev => ({ ...prev, [courseId]: true }));
        try {
          // TODO: Replace with actual API call when backend is ready
          // const response = await courseApi.getCourseStudents(courseId);

          // Mock data for now
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockStudents: StudentEnrollment[] = [
            {
              id: '1',
              fullName: 'John Doe',
              username: 'johndoe',
              avatar: undefined,
              progress: 75,
              status: 'IN_PROGRESS'
            },
            {
              id: '2',
              fullName: 'Jane Smith',
              username: 'janesmith',
              avatar: undefined,
              progress: 100,
              status: 'COMPLETED'
            }
          ];

          setCourseStudents(prev => ({ ...prev, [courseId]: mockStudents }));
        } catch (err) {
          console.error('Error fetching course students:', err);
        } finally {
          setLoadingStudents(prev => ({ ...prev, [courseId]: false }));
        }
      }
    }

    setExpandedCourses(newExpanded);
  };

  const getStatusVariant = (status: string): 'course' | 'combo' | 'fullcourse' => {
    switch (status) {
      case 'COMPLETED':
        return 'fullcourse';
      case 'IN_PROGRESS':
        return 'combo';
      default:
        return 'course';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Completed';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'NOT_STARTED':
        return 'Not Started';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-8 ${className}`}>
        <h3 className="text-lg font-bold text-gray-900 mb-4">{userRole === 'COMPANY' ? 'Created Courses' : 'Enrolled Courses'}</h3>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="text-gray-500 mt-3">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-8 ${className}`}>
        <h3 className="text-lg font-bold text-gray-900 mb-4">{userRole === 'COMPANY' ? 'Created Courses' : 'Enrolled Courses'}</h3>
        <div className="text-center py-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto text-red-400 mb-3"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-8 ${className}`}>
        <h3 className="text-lg font-bold text-gray-900 mb-4">{userRole === 'COMPANY' ? 'Created Courses' : 'Enrolled Courses'}</h3>
        <div className="text-center py-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto text-gray-400 mb-3"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <p className="text-gray-500">{userRole === 'COMPANY' ? 'No courses created yet' : 'No courses enrolled yet'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 ${className}`}>
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        {userRole === 'COMPANY' ? 'Created Courses' : 'Enrolled Courses'} ({courses.length})
      </h3>
      <div className="space-y-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors overflow-hidden"
          >
            {/* Course Header */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">{course.title}</h4>
                    {userRole === 'COMPANY' && course.enrolledStudents !== undefined && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                        <Users className="w-3 h-3" />
                        {course.enrolledStudents}
                      </span>
                    )}
                  </div>
                  {course.progress !== undefined && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    label={getStatusLabel(course.status)}
                    variant={getStatusVariant(course.status)}
                    className="text-xs shrink-0"
                  />
                  {userRole === 'COMPANY' && (
                    <Button
                      onClick={() => toggleCourseExpansion(course.id)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      title={expandedCourses.has(course.id) ? 'Hide students' : 'Show students'}
                    >
                      {expandedCourses.has(course.id) ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Students Dropdown */}
            {userRole === 'COMPANY' && expandedCourses.has(course.id) && (
              <div className="border-t border-gray-200 bg-white p-4">
                <h5 className="text-sm font-semibold text-gray-700 mb-3">Enrolled Students</h5>

                {loadingStudents[course.id] ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                    <span className="ml-2 text-sm text-gray-500">Loading students...</span>
                  </div>
                ) : courseStudents[course.id]?.length > 0 ? (
                  <div className="space-y-2">
                    {courseStudents[course.id].map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center text-sm font-medium overflow-hidden flex-shrink-0">
                          {student.avatar ? (
                            <img src={student.avatar} alt={student.fullName} className="w-full h-full object-cover" />
                          ) : (
                            <span>{student.fullName.charAt(0).toUpperCase()}</span>
                          )}
                        </div>

                        {/* Student Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{student.fullName}</p>
                          <p className="text-xs text-gray-500 truncate">@{student.username}</p>
                        </div>

                        {/* Progress */}
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="text-xs font-medium text-gray-700">{student.progress}%</p>
                            <p className="text-xs text-gray-500">{student.status === 'COMPLETED' ? 'Completed' : 'In Progress'}</p>
                          </div>
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full transition-all ${student.status === 'COMPLETED' ? 'bg-green-600' : 'bg-blue-600'
                                }`}
                              style={{ width: `${student.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No students enrolled yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
