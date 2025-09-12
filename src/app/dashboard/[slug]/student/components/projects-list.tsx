'use client';

import {useState, useEffect} from 'react';
import {useAuth} from '@/contexts/AuthContext';

type Project = {
  id: string;
  title: string;
  description: string;
  submissionDate: string;
  status: string;
  professor: string;
  rating: number | null;
  feedback: string | null;
};

export default function ProjectsList() {
  const {user} = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/projects?studentId=${user.id}`);
        const data = await response.json();

        if (data.success) {
          // Convert API data to match component structure
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formattedProjects = data.projects.map((project: any) => ({
            id: project.id.toString(),
            title: project.title,
            description: project.description,
            submissionDate: project.sendDate,
            status: project.isGraded ? 'reviewed' : 'pending',
            professor: project.publisher?.name || 'نامشخص',
            rating: project.rating,
            feedback: project.feedback,
          }));
          setProjects(formattedProjects);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  // Filter projects based on search query and status filter
  const filteredProjects = projects.filter((project) => {
    const matchesQuery =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === 'all' || project.status === selectedStatus;

    return matchesQuery && matchesStatus;
  });

  // Status badge component
  const StatusBadge = ({status}: {status: string}) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-green-100 text-green-800',
    };

    const labels = {
      pending: 'در انتظار بررسی',
      reviewed: 'بررسی شده',
    };

    return (
      <span
        className={`text-xs px-2 py-1 rounded-full ${styles[status as keyof typeof styles]}`}
      >
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  // Star rating component
  const StarRating = ({rating}: {rating: number | null}) => {
    if (rating === null)
      return <span className="text-gray-400">هنوز امتیازی داده نشده</span>;

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex items-center">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <span key={index} className="text-yellow-400">
              {index < fullStars
                ? '★'
                : index === fullStars && hasHalfStar
                  ? '⯪'
                  : '☆'}
            </span>
          ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">
          پروژه‌های من
          {loading && (
            <span className="text-sm text-gray-500 mr-2">
              (در حال بارگذاری...)
            </span>
          )}
        </h2>
        <div className="flex space-x-2">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="جستجو..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
              🔍
            </span>
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">همه</option>
            <option value="pending">در انتظار بررسی</option>
            <option value="reviewed">بررسی شده</option>
          </select>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          هیچ پروژه‌ای یافت نشد
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-right">
                <th className="px-4 py-2 text-gray-600">عنوان</th>
                <th className="px-4 py-2 text-gray-600">تاریخ ارسال</th>
                <th className="px-4 py-2 text-gray-600">استاد</th>
                <th className="px-4 py-2 text-gray-600">وضعیت</th>
                <th className="px-4 py-2 text-gray-600">امتیاز</th>
                <th className="px-4 py-2 text-gray-600">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-semibold">{project.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {project.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {project.submissionDate}
                  </td>
                  <td className="px-4 py-3 text-sm">{project.professor}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="px-4 py-3">
                    <StarRating rating={project.rating} />
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-primary hover:underline text-sm">
                      مشاهده
                    </button>
                    {project.feedback && (
                      <div className="text-xs text-gray-500 mt-1">
                        بازخورد:{' '}
                        {project.feedback.length > 30
                          ? `${project.feedback.substring(0, 30)}...`
                          : project.feedback}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
