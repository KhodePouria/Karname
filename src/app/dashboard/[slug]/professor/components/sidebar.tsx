'use client';

import {Dispatch, SetStateAction} from 'react';
import Link from 'next/link';
import {useAuth} from '@/contexts/AuthContext';
import {
  ArrowLeft,
  ArrowRight,
  ChartBar,
  Folder,
  LogOut,
  Settings,
  User,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  isCollapsed?: boolean;
  toggleCollapse?: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  isCollapsed = false,
  toggleCollapse,
}: SidebarProps) {
  const {user, logout} = useAuth();

  const menuItems = [
    {id: 'dashboard', name: 'داشبورد', icon: <ChartBar />},
    {id: 'projects', name: 'پروژه‌های دانشجویی', icon: <Folder />},
    {id: 'students', name: 'دانشجویان', icon: <User />},
    {id: 'settings', name: 'تنظیمات', icon: <Settings />},
  ];

  return (
    <div
      className={`bg-white shadow-md h-screen sticky top-0 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-100">
        {!isCollapsed && (
          <Link href="/" className="text-primary font-bold text-lg">
            کارنامه
          </Link>
        )}
        <button
          onClick={toggleCollapse}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          {isCollapsed ? <ArrowRight /> : <ArrowLeft />}
        </button>
      </div>

      <div className="p-3">
        {!isCollapsed && (
          <div className="flex flex-col items-center mb-6 mt-2">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-2">
              <span className="text-2xl">👨‍🏫</span>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-gray-800">
                {user?.name || 'دکتر خضوعی'}
              </h3>
              <p className="text-xs text-gray-500">
                استاد دانشکده مهندسی {user?.major}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-1">
          {menuItems.map((item) => {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center p-2 rounded-lg w-full ${
                  activeTab === item.id
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {!isCollapsed && <span className="mr-3">{item.name}</span>}
              </button>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center p-2 rounded-lg text-red-600 hover:bg-red-50 w-full"
          >
            <span className="text-lg">
              <LogOut />
            </span>
            {!isCollapsed && <span className="mr-3">خروج</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
