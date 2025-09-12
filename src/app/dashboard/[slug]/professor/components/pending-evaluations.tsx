'use client';

import {useState, useEffect} from 'react';
import {useAuth} from '@/contexts/AuthContext';

// Define project type
type Project = {
  id: string;
  title: string;
  student: string;
  studentId: string;
  major: string;
  submissionDate: string;
  publishDate: string;
  description: string;
  projectAddress: string;
};

// Define valid sort keys
type SortKey = 'title' | 'student' | 'submissionDate';

export default function PendingEvaluations() {
  const {user} = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>('submissionDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch pending projects
  useEffect(() => {
    const fetchPendingProjects = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/projects?professorId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Filter for pending projects and format
            const formattedProjects = data.projects
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .filter((project: any) => !project.isGraded)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .map((project: any) => ({
                id: project.id.toString(),
                title: project.title,
                student: project.sender?.name || 'نامشخص',
                studentId: project.sender?.id.toString() || '',
                major: 'نامشخص', // This field isn't in our schema
                submissionDate: project.sendDate,
                publishDate: project.publishedDate,
                description: project.description,
                projectAddress: project.projectAddress,
              }));
            setProjects(formattedProjects);
          }
        } else {
          console.error('Failed to fetch pending projects');
        }
      } catch (error) {
        console.error('Error fetching pending projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingProjects();
  }, [user?.id]);

  // Handle sorting
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Filter and sort projects
  const filteredProjects = projects
    .filter(
      (project) =>
        project.title.includes(searchTerm) ||
        project.student.includes(searchTerm) ||
        project.studentId.includes(searchTerm) ||
        project.major.includes(searchTerm)
    )
    .sort((a, b) => {
      if (sortDirection === 'asc') {
        return a[sortKey] > b[sortKey] ? 1 : -1;
      } else {
        return a[sortKey] < b[sortKey] ? 1 : -1;
      }
    });

  return (
    <div className="bg-white rounded-xl shadow-md p-4 lg:p-6">
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:justify-between lg:items-center">
        <h2 className="text-lg font-bold text-primary lg:text-2xl">
          پروژه‌های در انتظار ارزیابی
        </h2>

        <div className="relative w-full lg:w-auto">
          <input
            type="text"
            placeholder="جستجو..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-8 pl-3 py-2 border rounded-lg text-sm lg:w-64"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-500 mt-2">در حال بارگذاری...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          هیچ پروژه‌ای برای ارزیابی وجود ندارد
        </div>
      ) : (
        <>
          {/* Mobile Card Layout */}
          <div className="block lg:hidden space-y-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="border rounded-lg p-4 bg-gray-50"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-gray-900">{project.title}</h3>
                  <div className="flex flex-col gap-1">
                    <button className="text-xs text-primary hover:text-primary-dark px-2 py-1 bg-white rounded">
                      مشاهده
                    </button>
                    <button className="text-xs text-green-600 hover:text-green-800 px-2 py-1 bg-white rounded">
                      ارزیابی
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">دانشجو:</span>
                    <span className="text-gray-900">{project.student}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">رشته:</span>
                    <span className="text-gray-900">{project.major}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">تاریخ ارسال:</span>
                    <span className="text-gray-900">
                      {project.submissionDate}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    onClick={() => handleSort('title')}
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  >
                    عنوان پروژه{' '}
                    {sortKey === 'title' &&
                      (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    onClick={() => handleSort('student')}
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  >
                    دانشجو{' '}
                    {sortKey === 'student' &&
                      (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    onClick={() => handleSort('submissionDate')}
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  >
                    تاریخ ارسال{' '}
                    {sortKey === 'submissionDate' &&
                      (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    رشته
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {project.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {project.student}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {project.submissionDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {project.major}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                      <button className="text-primary hover:text-primary-dark ml-3">
                        مشاهده
                      </button>
                      <button className="text-green-600 hover:text-green-800">
                        ارزیابی
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
