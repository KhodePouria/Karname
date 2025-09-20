'use client';

import {useEffect, useState} from 'react';
import {useAuth} from '@/contexts/AuthContext';
import {Folder, Hourglass, FileCheck2, Star} from 'lucide-react';

type Project = {
  id: number;
  title: string;
  isGraded: boolean;
  rating: number | null;
};

export default function StatsCards() {
  const {user} = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    avg: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/projects?studentId=${user.id}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.projects)) {
          const projects = data.projects;
          const total = projects.length;
          const reviewed = projects.filter((p: Project) => p.isGraded).length;
          const pending = total - reviewed;
          const rated = projects.filter(
            (p: Project) => p.rating !== null && p.rating !== undefined
          );
          const avg = rated.length
            ? Math.round(
                (rated.reduce(
                  (s: number, p: Project) => s + (p.rating || 0),
                  0
                ) /
                  rated.length) *
                  10
              ) / 10
            : 0;
          setStats({total, pending, reviewed, avg});
        } else {
          setStats({total: 0, pending: 0, reviewed: 0, avg: 0});
        }
      } catch {
        setStats({total: 0, pending: 0, reviewed: 0, avg: 0});
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

  const cards = [
    {
      title: 'کل پروژه‌ها',
      value: stats.total,
      icon: <Folder />,
      color: 'bg-blue-100 text-blue-800',
    },
    {
      title: 'در انتظار بررسی',
      value: stats.pending,
      icon: <Hourglass />,
      color: 'bg-yellow-100 text-yellow-800',
    },
    {
      title: 'بررسی شده',
      value: stats.reviewed,
      icon: <FileCheck2 />,
      color: 'bg-green-100 text-green-800',
    },
    {
      title: 'میانگین امتیاز',
      value: `${stats.avg}`,
      icon: <Star />,
      color: 'bg-purple-100 text-purple-800',
      hint: '/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-xl shadow-md flex items-center"
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color}`}
          >
            <span className="text-xl">{stat.icon}</span>
          </div>
          <div className="mr-4">
            <div className="text-sm text-gray-500">{stat.title}</div>
            <div className="flex items-baseline gap-1">
              <div className="text-2xl font-bold text-gray-700">
                {loading ? '—' : stat.value}
              </div>
              {stat.hint && !loading && (
                <span className="text-xs text-gray-400">{stat.hint}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
