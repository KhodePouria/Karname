'use client';

import {useAuth} from '@/contexts/AuthContext';

interface DashboardHeaderProps {
  title: string;
}

export default function DashboardHeader({title}: DashboardHeaderProps) {
  const {user, logout} = useAuth();

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
      <div className="flex items-center">
        <div className="flex items-center ml-4">
          <span className="text-sm text-gray-600 ml-2">
            خوش آمدید، {user?.name}
          </span>
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
            {user?.name?.charAt(0) || 'ک'}
          </div>
        </div>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
        >
          خروج
        </button>
      </div>
    </div>
  );
}
