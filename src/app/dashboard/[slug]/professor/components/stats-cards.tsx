'use client';

import {useState, useEffect} from 'react';
import {useAuth} from '@/contexts/AuthContext';

type Stats = {
  pendingEvaluations: number;
  evaluatedProjects: number;
  activeStudents: number;
  todaysProjects: number;
};

export default function StatsCards() {
  const {user} = useAuth();
  const [stats, setStats] = useState<Stats>({
    pendingEvaluations: 0,
    evaluatedProjects: 0,
    activeStudents: 0,
    todaysProjects: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await fetch(
          `/api/professor/stats?professorId=${user.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

  const statItems = [
    {
      title: 'پروژه‌های منتظر ارزیابی',
      value: loading ? '...' : stats.pendingEvaluations.toString(),
      icon: '📝',
      color: 'bg-yellow-100 text-yellow-800',
    },
    {
      title: 'پروژه‌های بررسی شده',
      value: loading ? '...' : stats.evaluatedProjects.toString(),
      icon: '✅',
      color: 'bg-green-100 text-green-800',
    },
    {
      title: 'دانشجویان فعال',
      value: loading ? '...' : stats.activeStudents.toString(),
      icon: '👨‍🎓',
      color: 'bg-blue-100 text-blue-800',
    },
    {
      title: 'پروژه‌های امروز',
      value: loading ? '...' : stats.todaysProjects.toString(),
      icon: '📌',
      color: 'bg-red-100 text-red-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat, index) => (
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
            <div className="text-sm text-black">{stat.title}</div>
            <div className="text-2xl font-bold text-gray-600">{stat.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
