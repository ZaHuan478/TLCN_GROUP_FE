import React from 'react';
import { Badge } from '../../atoms/Badge';

type CourseProgress = {
  id: string;
  title: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED';
  progress?: number;
};

type UserCoursesSectionProps = {
  courses: CourseProgress[];
  className?: string;
};

export const UserCoursesSection: React.FC<UserCoursesSectionProps> = ({
  courses,
  className = '',
}) => {
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

  if (courses.length === 0) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-8 ${className}`}>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Enrolled Courses</h3>
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
          <p className="text-gray-500">No courses enrolled yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 ${className}`}>
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Enrolled Courses ({courses.length})
      </h3>
      <div className="space-y-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{course.title}</h4>
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
              <Badge
                label={getStatusLabel(course.status)}
                variant={getStatusVariant(course.status)}
                className="text-xs shrink-0"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
