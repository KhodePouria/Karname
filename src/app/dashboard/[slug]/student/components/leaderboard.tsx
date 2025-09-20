'use client';

import {useState, useEffect} from 'react';
import {useAuth} from '@/contexts/AuthContext';

interface LeaderboardEntry {
  id: string;
  name: string;
  rating: number;
  projectsCount: number;
  rank: number;
}

export default function Leaderboard() {
  const {user} = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard');
        const data = await response.json();

        if (data.success) {
          setLeaderboard(data.leaderboard);
        } else {
          console.error('Error fetching leaderboard:', data.error);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [user]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="mr-3 text-gray-600">
            در حال بارگذاری جدول رتبه‌بندی...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl text-primary`}>🏆 جدول رتبه‌بندی نمرات</h3>
        <div className="text-sm text-gray-500">
          آخرین به‌روزرسانی: {new Date().toLocaleDateString('fa-IR')}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-right py-4 px-4 font-semibold text-gray-700">
                رتبه
              </th>
              <th className="text-right py-4 px-4 font-semibold text-gray-700">
                دانشجو
              </th>
              <th className="text-right py-4 px-4 font-semibold text-gray-700">
                میانگین نمره
              </th>
              <th className="text-right py-4 px-4 font-semibold text-gray-700">
                تعداد پروژه
              </th>
              <th className="text-right py-4 px-4 font-semibold text-gray-700">
                وضعیت
              </th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry) => {
              const isCurrentUser = entry.id === user?.id;
              const isTopThree = entry.rank <= 3;

              return (
                <tr
                  key={entry.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    isCurrentUser ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      {isTopThree && (
                        <span className="text-2xl mr-2">
                          {entry.rank === 1
                            ? '🥇'
                            : entry.rank === 2
                              ? '🥈'
                              : '🥉'}
                        </span>
                      )}
                      <span
                        className={`font-semibold ${
                          isCurrentUser ? 'text-blue-600' : 'text-gray-800'
                        }`}
                      >
                        #{entry.rank}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                          isCurrentUser
                            ? 'bg-blue-500'
                            : isTopThree
                              ? 'bg-yellow-500'
                              : 'bg-gray-400'
                        }`}
                      >
                        {entry.name.charAt(0)}
                      </div>
                      <div className="mr-3">
                        <div
                          className={`font-semibold ${
                            isCurrentUser ? 'text-blue-600' : 'text-gray-800'
                          }`}
                        >
                          {entry.name} {isCurrentUser && '(شما)'}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <span
                        className={`text-lg ${
                          entry.rating >= 18
                            ? 'text-green-600'
                            : entry.rating >= 15
                              ? 'text-yellow-600'
                              : 'text-red-600'
                        }`}
                      >
                        {entry.rating}
                      </span>
                      <span className="text-gray-500 mr-1">/20</span>
                      <div className="mr-2">
                        {entry.rating >= 18
                          ? '🌟'
                          : entry.rating >= 15
                            ? '⭐'
                            : '📈'}
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-semibold text-gray-700">
                      {entry.projectsCount} پروژه
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        entry.rating >= 18
                          ? 'bg-green-100 text-green-700'
                          : entry.rating >= 15
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {entry.rating >= 18
                        ? 'عالی'
                        : entry.rating >= 15
                          ? 'خوب'
                          : 'نیاز به تلاش'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* User's rank highlight */}
      {user && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">رتبه شما:</h4>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-blue-600">
                رتبه{' '}
                {leaderboard.find((l) => l.id === user.id)?.rank || 'نامشخص'} از{' '}
                {leaderboard.length} نفر
              </span>
            </div>
            <div className="text-sm text-blue-600">
              {leaderboard.find((l) => l.id === user.id)?.rating
                ? `میانگین: ${leaderboard.find((l) => l.id === user.id)?.rating}/20`
                : 'هنوز نمره‌ای ثبت نشده'}
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 text-center">
        * جدول رتبه‌بندی بر اساس میانگین نمرات پروژه‌ها محاسبه می‌شود
      </div>
    </div>
  );
}
