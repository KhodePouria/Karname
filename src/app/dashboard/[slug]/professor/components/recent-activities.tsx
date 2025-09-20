'use client';

import {useState, useEffect} from 'react';
import {useAuth} from '@/contexts/AuthContext';
import {FileCheck2, MessageCircle, StickyNote} from 'lucide-react';

type Activity = {
  id: string;
  type: 'submission' | 'evaluation' | 'message';
  message: string;
  date: string;
  time: string;
  projectId: string | null;
};

export default function RecentActivities() {
  const {user} = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await fetch(
          `/api/professor/activities?professorId=${user.id}&limit=20`
        );
        if (response.ok) {
          const data = await response.json();
          setActivities(data);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [user?.id]);

  // Filter activities based on selected filter
  const filteredActivities =
    filter === 'all'
      ? activities
      : activities.filter((activity) => activity.type === filter);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 lg:p-6">
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:justify-between lg:items-center">
        <h2 className="text-lg font-bold text-primary lg:text-2xl">
          فعالیت‌های اخیر
        </h2>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-lg ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            همه
          </button>
          <button
            onClick={() => setFilter('submission')}
            className={`px-3 py-1 text-sm rounded-lg ${
              filter === 'submission'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            ارسال‌های جدید
          </button>
          <button
            onClick={() => setFilter('evaluation')}
            className={`px-3 py-1 text-sm rounded-lg ${
              filter === 'evaluation'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            ارزیابی‌ها
          </button>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-500 mt-2">در حال بارگذاری فعالیت‌ها...</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            هیچ فعالیتی یافت نشد
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div key={activity.id} className="border-b pb-4 last:border-b-0">
              <div className="flex">
                <div className="ml-3 flex-shrink-0">
                  {activity.type === 'submission' && (
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center">
                      <StickyNote />
                    </div>
                  )}
                  {activity.type === 'evaluation' && (
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center">
                      <FileCheck2 />
                    </div>
                  )}
                  {activity.type === 'message' && (
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center">
                      <MessageCircle />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 text-sm lg:text-base">
                    {activity.message}
                  </p>
                  <div className="flex flex-col gap-1 mt-2 lg:flex-row lg:items-center">
                    <span className="text-xs text-gray-500">
                      {activity.date} - {activity.time}
                    </span>
                    {activity.projectId && (
                      <button className="text-xs text-primary hover:underline self-start lg:mr-2">
                        مشاهده پروژه
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
