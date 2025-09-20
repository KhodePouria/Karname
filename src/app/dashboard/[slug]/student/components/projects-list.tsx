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
  projectUrl?: string | null;
};

export default function ProjectsList() {
  const {user} = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const openModal = (p: Project) => {
    setSelectedProject(p);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };
  const copyDownloadLink = async () => {
    if (!selectedProject) return;
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/api/projects/${selectedProject.id}/download`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!isModalOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeModal();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isModalOpen]);

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

  // Replace star rating with a numeric badge out of 20
  const ScoreBadge20 = ({value}: {value: number | null}) => {
    if (value === null) return <span className="text-gray-400">—</span>;
    const clamp20 = (r: number) => Math.max(0, Math.min(20, r));
    const score = clamp20(value);
    const rounded = Math.round(score * 10) / 10; // one decimal
    const color =
      score >= 16
        ? 'bg-green-100 text-green-800'
        : score >= 12
          ? 'bg-yellow-100 text-yellow-800'
          : 'bg-red-100 text-red-800';
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>
        {`${rounded % 1 === 0 ? Math.trunc(rounded) : rounded}/20`}
      </span>
    );
  };

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleString('fa-IR');
    } catch {
      return d;
    }
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
                    <ScoreBadge20 value={project.rating} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal(project)}
                        className="text-primary hover:underline text-sm"
                      >
                        مشاهده
                      </button>
                    </div>
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

      {isModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={closeModal}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-xl bg-white rounded-2xl shadow-2xl p-0 overflow-hidden animate-[fadeIn_120ms_ease-out]"
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 text-primary flex items-center justify-center">
                  📁
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-primary mb-0.5">
                    {selectedProject.title}
                  </h3>
                  <div className="text-xs text-gray-500">
                    استاد: {selectedProject.professor}
                  </div>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 p-2"
                aria-label="بستن"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="text-sm text-gray-700">
                  <div className="text-gray-500 mb-1">تاریخ ارسال</div>
                  <div>{formatDate(selectedProject.submissionDate)}</div>
                </div>
                <div className="text-sm text-gray-700">
                  <div className="text-gray-500 mb-1">وضعیت</div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={selectedProject.status} />
                    <ScoreBadge20 value={selectedProject.rating} />
                  </div>
                </div>
              </div>

              {selectedProject.description && (
                <div className="mt-2">
                  <div className="text-sm text-gray-500 mb-1">توضیحات</div>
                  <div className="text-sm text-gray-800 leading-6 max-h-48 overflow-y-auto whitespace-pre-wrap rounded-lg border border-gray-100 p-3 bg-gray-50/50">
                    {selectedProject.description}
                  </div>
                </div>
              )}

              {selectedProject.feedback && (
                <div className="mt-4">
                  <div className="text-sm text-gray-500 mb-1">
                    بازخورد استاد
                  </div>
                  <div className="text-sm text-gray-800 leading-6 rounded-lg border border-green-100 p-3 bg-green-50/50">
                    {selectedProject.feedback}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                onClick={copyDownloadLink}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                title="کپی لینک دانلود"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                {copied ? 'کپی شد!' : 'کپی لینک'}
              </button>
              <a
                href={selectedProject.projectUrl || undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                دانلود پروژه
              </a>
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
