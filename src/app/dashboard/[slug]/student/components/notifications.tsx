'use client';

import {useState} from 'react';

type Notification = {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  projectId: string | null;
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

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
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold text-primary">اعلانات</h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 mr-2">
              {unreadCount} جدید
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-primary hover:underline"
          >
            علامت‌گذاری همه به عنوان خوانده‌شده
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          هیچ اعلانی وجود ندارد
        </div>
      ) : (
        <div className="space-y-4">
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
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <span>{notification.date}</span>
                      {notification.projectId && (
                        <>
                          <span className="mx-2">•</span>
                          <a href="#" className="text-primary hover:underline">
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
  );
}
