'use client';

import {useEffect, useState} from 'react';
import {useAuth} from '@/contexts/AuthContext';

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type?: 'assignment' | 'grade' | 'info';
  projectId?: number | null;
  assignmentId?: number | null;
  classroomId?: number | null;
};

export default function Notifications() {
  const {user} = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/notifications?studentId=${user.id}`);
        const data = await res.json();
        if (data.success) {
          setNotifications(data.notifications || []);
        } else {
          setError(data.error || 'خطای ناشناخته');
        }
      } catch (e) {
        setError('خطا در دریافت اعلانات');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user?.id]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? {...notif, read: true} : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({...notif, read: true})));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 h-full min-h-[300px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border hover:bg-gray-50"
            aria-label="toggle"
            title="باز/بسته کردن"
          >
            <span className="text-lg">{open ? '▾' : '▸'}</span>
          </button>
          <h2 className="text-2xl font-bold text-primary">اعلانات</h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {unreadCount} جدید
            </span>
          )}
        </div>

        {unreadCount > 0 && open && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-primary hover:underline"
          >
            علامت‌گذاری همه به عنوان خوانده‌شده
          </button>
        )}
      </div>

      {open && (
        <div className="flex-1 min-h-0">
          {loading ? (
            <div className="text-center py-10 text-gray-500">
              در حال بارگذاری...
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              هیچ اعلانی وجود ندارد
            </div>
          ) : (
            <div
              className="space-y-4 overflow-y-auto pr-2"
              style={{maxHeight: 360}}
            >
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    notification.read ? 'bg-white' : 'bg-blue-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div
                        className={`w-2 h-2 mt-2 rounded-full mr-2 ${
                          notification.read ? 'bg-gray-300' : 'bg-blue-500'
                        }`}
                      />
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-gray-500 gap-2">
                          <span>
                            {new Date(notification.date).toLocaleString(
                              'fa-IR'
                            )}
                          </span>
                          {notification.classroomId && (
                            <>
                              <span className="mx-1">•</span>
                              <a
                                href={`/dashboard/${user?.id}/student/classrooms/${notification.classroomId}`}
                                className="text-primary hover:underline"
                              >
                                مشاهده کلاس
                              </a>
                            </>
                          )}
                          {!notification.classroomId &&
                            notification.projectId && (
                              <>
                                <span className="mx-1">•</span>
                                <a
                                  href="#"
                                  className="text-primary hover:underline"
                                >
                                  مشاهده پروژه
                                </a>
                              </>
                            )}
                        </div>
                      </div>
                    </div>

                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        خوانده شد
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
