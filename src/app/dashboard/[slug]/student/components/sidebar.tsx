'use client';

import {useState} from 'react';
import {useAuth} from '@/contexts/AuthContext';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Folder,
  LayoutDashboard,
  LogOut,
  Star,
  User,
} from 'lucide-react';

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

export default function Sidebar({activeItem, onItemClick}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const {user, logout} = useAuth();

  const menuItems = [
    {name: 'داشبورد', id: 'dashboard', icon: <LayoutDashboard />},
    {name: 'پروژه‌های من', id: 'projects', icon: <Folder />},
    {name: 'جدول رتبه‌بندی', id: 'leaderboard', icon: <Star />},
    {name: 'اعلانات', id: 'notifications', icon: <Bell />},
    {name: 'پروفایل', id: 'profile', icon: <User />},
  ];

  return (
    <div
      className={`bg-white shadow-md h-screen sticky top-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-100">
        {!collapsed && (
          <div className="text-primary font-bold text-lg">کارنامه</div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          {collapsed ? <ArrowRight /> : <ArrowLeft />}
        </button>
      </div>

      <div className="p-3">
        {!collapsed && (
          <div className="flex flex-col items-center mb-6 mt-2">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-2">
              <span className="text-2xl">👨‍🎓</span>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-gray-800">
                {user?.name || 'محمد محمدی'}
              </h3>
              <p className="text-xs text-gray-500">
                {user?.major ? `دانشجوی ${user.major}` : 'دانشجوی کارشناسی'}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-1">
          {menuItems.map((item) => {
            return (
              <button
                onClick={() => onItemClick(item.id)}
                key={item.name}
                className={`w-full flex items-center p-2 rounded-lg transition-colors ${
                  activeItem === item.id
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {!collapsed && (
                  <span className="mr-3 text-right">{item.name}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Logout Button */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center p-2 rounded-lg text-red-600 hover:bg-red-50 w-full"
          >
            <span className="text-lg">
              <LogOut />
            </span>
            {!collapsed && <span className="mr-3">خروج</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
