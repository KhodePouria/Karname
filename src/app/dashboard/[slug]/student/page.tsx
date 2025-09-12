'use client';

import {useState} from 'react';
import Sidebar from './components/sidebar';
import StatsCards from './components/stats-cards';
import ProjectUpload from './components/project-upload';
import ProjectsList from './components/projects-list';
import Notifications from './components/notifications';
import Leaderboard from './components/leaderboard';

import ProtectedRoute from '@/components/ProtectedRoute';
import {useAuth} from '@/contexts/AuthContext';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const {user} = useAuth();

  // Content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div className="mb-6">
              <StatsCards />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <ProjectUpload />
              </div>
              <div>
                <Notifications />
              </div>
            </div>
          </>
        );
      case 'projects':
        return <ProjectsList />;
      case 'notifications':
        return <Notifications />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'profile':
        return (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-primary mb-6">پروفایل من</h2>
            <div className="flex flex-col items-center md:flex-row">
              <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center mb-4 md:mb-0">
                <span className="text-4xl">👨‍🎓</span>
              </div>
              <div className="md:mr-8 text-center md:text-right">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {user?.name}
                </h3>
                <div className="flex flex-col gap-1 ">
                  <p className="text-gray-600">دانشجوی {user?.major}</p>
                  <p className="text-gray-600">
                    شماره دانشجویی: {user?.studentNumber}
                  </p>
                  <p className="text-gray-600">سال ورودی: {user?.year}</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div>در حال بارگذاری...</div>;
    }
  };

  return (
    <ProtectedRoute requiredRole="student">
      <div className="flex h-screen bg-gray-100 text-right" dir="rtl">
        {/* Sidebar */}
        <Sidebar activeItem={activeTab} onItemClick={setActiveTab} />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <h1 className={`text-2xl font-bold text-primary`}>
                  {activeTab === 'dashboard' && 'داشبورد'}
                  {activeTab === 'projects' && 'پروژه‌های من'}
                  {activeTab === 'leaderboard' && 'جدول رتبه‌بندی'}
                  {activeTab === 'notifications' && 'اعلانات'}
                  {activeTab === 'profile' && 'پروفایل'}
                </h1>
              </div>
            </div>
          </header>

          {/* Mobile Tabs */}
          <div className="md:hidden flex overflow-x-auto bg-white shadow-sm mb-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 flex-1 text-center ${activeTab === 'dashboard' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
            >
              داشبورد
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 flex-1 text-center ${activeTab === 'projects' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
            >
              پروژه‌ها
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-4 py-2 flex-1 text-center whitespace-nowrap ${activeTab === 'leaderboard' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
            >
              رتبه‌بندی
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-2 flex-1 text-center ${activeTab === 'notifications' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
            >
              اعلانات
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 flex-1 text-center ${activeTab === 'profile' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
            >
              پروفایل
            </button>
          </div>

          {/* Main Content Area */}
          <main className="p-4">
            <div className="container mx-auto max-w-7xl">
              {/* Welcome Section */}
              {activeTab === 'dashboard' && (
                <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl p-6 mb-6">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        خوش آمدید، {user?.name?.split(' ')[0] || 'محمد'}!
                      </h2>
                      <p className="text-white/90">
                        به داشبورد کارنامه خود خوش آمدید. از اینجا می‌توانید
                        پروژه‌های خود را مدیریت کنید و بازخوردهای اساتید را
                        مشاهده کنید.
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <button className="bg-white text-primary px-4 py-2 rounded-lg font-bold hover:bg-white/90 transition-colors">
                        پروژه جدید +
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Content Based on Tab */}
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
