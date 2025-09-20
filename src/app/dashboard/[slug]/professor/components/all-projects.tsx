'use client';

import {useEffect, useMemo, useState} from 'react';
import {useAuth} from '@/contexts/AuthContext';
import {Search} from 'lucide-react';

// Row type for UI
type ProjectRow = {
  id: number;
  title: string;
  description?: string | null;
  sendDate: string; // ISO string
  rating: number | null;
  isGraded: boolean;
  projectAddress: string | null;
  sender?: {
    id: number | string;
    name: string;
  } | null;
};

const Allprojects = () => {
  const {user} = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | 'graded' | 'pending'>('all');

  useEffect(() => {
    const fetchAll = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/projects?professorId=${user.id}`);
        const data = await res.json();
        if (!res.ok || !data.success)
          throw new Error(data.error || 'خطا در دریافت پروژه‌ها');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rows: ProjectRow[] = (data.projects as any[]).map((p) => ({
          id: Number(p.id),
          title: p.title,
          description: p.description ?? null,
          sendDate: p.sendDate, // ISO string from API
          rating: p.rating ?? null,
          isGraded: Boolean(p.isGraded),
          projectAddress: p.projectAddress ?? null,
          sender: p.sender
            ? {id: p.sender.id, name: p.sender.name}
            : p.senderId && p.senderName
              ? {id: p.senderId, name: p.senderName}
              : null,
        }));
        setProjects(rows);
      } catch (e) {
        console.error(e);
        setError(e instanceof Error ? e.message : 'خطای نامشخص');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user?.id]);

  const filtered = useMemo(() => {
    return projects
      .filter((p) => {
        if (status === 'graded' && !p.isGraded) return false;
        if (status === 'pending' && p.isGraded) return false;
        const q = query.trim().toLowerCase();
        if (!q) return true;
        const hay =
          `${p.title} ${p.description ?? ''} ${p.sender?.name ?? ''}`.toLowerCase();
        return hay.includes(q);
      })
      .sort(
        (a, b) =>
          new Date(b.sendDate).getTime() - new Date(a.sendDate).getTime()
      );
  }, [projects, query, status]);

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleString('fa-IR');
    } catch {
      return d;
    }
  };

  // Rating out of 20 with a nicer badge UI
  const clamp20 = (r: number) => Math.max(0, Math.min(20, r));
  const ScoreBadge20 = ({rating}: {rating: number | null}) => {
    if (rating === null) return <span className="text-gray-400">—</span>;
    const score = clamp20(rating);
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

  const getInitials = (name?: string) => {
    if (!name) return '—';
    const parts = name.trim().split(/\s+/);
    return parts
      .map((p) => p.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl p-4 lg:p-6">
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-lg font-bold text-primary lg:text-2xl">
          همه پروژه‌ها
        </h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="جستجو بر اساس عنوان یا نام دانشجو..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-44 lg:w-64"
            />
            <span className="absolute left-2 top-1/2 -translate-y-1/2">
              <Search />
            </span>
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">همه</option>
            <option value="pending">در انتظار ارزیابی</option>
            <option value="graded">ارزیابی شده</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-500 mt-3">در حال بارگذاری...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-600">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          هیچ پروژه‌ای یافت نشد
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-right">
                <th className="px-4 py-3 text-gray-600">عنوان</th>
                <th className="px-4 py-3 text-gray-600">دانشجو</th>
                <th className="px-4 py-3 text-gray-600">تاریخ ارسال</th>
                <th className="px-4 py-3 text-gray-600">امتیاز</th>
                <th className="px-4 py-3 text-gray-600">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-semibold">{p.title}</div>
                      {p.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {p.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">
                        {getInitials(p.sender?.name)}
                      </div>
                      <span>{p.sender?.name ?? 'نامشخص'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatDate(p.sendDate)}
                  </td>
                  <td className="px-4 py-3">
                    <ScoreBadge20 rating={p.rating} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <a
                        href={`/api/projects/${p.id}/download`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-all hover:-translate-y-0.5 shadow-sm"
                        title="دانلود فایل پروژه"
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
                        دانلود
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Allprojects;
