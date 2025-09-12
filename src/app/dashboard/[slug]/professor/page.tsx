'use client';

import {useState} from 'react';
import Sidebar from './components/sidebar';
import StatsCards from './components/stats-cards';
import PendingEvaluations from './components/pending-evaluations';
import ProjectEvaluations from './components/project-evaluations';
import RecentActivities from './components/recent-activities';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ProfessorDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Toggle sidebar collapsed state for desktop
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <ProtectedRoute requiredRole="professor">
      <div
        className="flex flex-col lg:flex-row min-h-screen bg-gray-100 text-right"
        dir="rtl"
      >
        {/* Sidebar - Hidden on mobile, overlay on tablet */}
        <div className="hidden lg:block">
          <Sidebar
            isCollapsed={sidebarCollapsed}
            toggleCollapse={toggleSidebar}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden bg-white shadow-sm border-b">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-bold text-gray-800">
              {activeTab === 'dashboard' && 'داشبورد'}
              {activeTab === 'projects' && 'پروژه‌های دانشجویی'}

              {activeTab === 'students' && 'دانشجویان'}

              {activeTab === 'settings' && 'تنظیمات'}
            </h1>
            <button
              onClick={toggleMobileSidebar}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
            onClick={toggleMobileSidebar}
          >
            <div
              className="w-64 bg-white h-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar
                isCollapsed={false}
                toggleCollapse={toggleMobileSidebar}
                activeTab={activeTab}
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setMobileSidebarOpen(false); // Close mobile sidebar when tab is selected
                }}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div
          className={`flex-1 transition-all duration-300 overflow-y-auto ${!sidebarCollapsed ? 'lg:mr-6' : 'lg:mr-20'}`}
        >
          <div className="p-4 lg:p-8">
            {/* Dashboard Header - Hidden on mobile (shown in mobile nav) */}
            <div className="hidden lg:flex justify-between items-center mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                {activeTab === 'dashboard' && 'داشبورد'}
                {activeTab === 'projects' && 'پروژه‌های دانشجویی'}

                {activeTab === 'students' && 'دانشجویان'}

                {activeTab === 'settings' && 'تنظیمات'}
              </h1>
            </div>

            {/* Mobile Tab Navigation */}
            <div className="lg:hidden mb-6">
              <div className="flex overflow-x-auto bg-white rounded-lg shadow-sm">
                {[
                  {id: 'dashboard', label: 'داشبورد', icon: '📊'},
                  {id: 'projects', label: 'پروژه‌ها', icon: '📁'},
                  {id: 'students', label: 'دانشجویان', icon: '👥'},
                  {id: 'settings', label: 'تنظیمات', icon: '⚙️'},
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center px-3 py-2 min-w-0 flex-1 text-xs transition-colors ${
                      activeTab === tab.id
                        ? 'text-primary border-b-2 border-primary bg-blue-50'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg mb-1">{tab.icon}</span>
                    <span className="truncate">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dashboard Content */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 lg:space-y-8">
                {/* Stats Row */}
                <StatsCards />

                {/* Main Content Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                  {/* Pending Evaluations - Takes 2/3 of the row on large screens, full width on mobile */}
                  <div className="lg:col-span-2 order-2 lg:order-1">
                    <PendingEvaluations />
                  </div>

                  {/* Recent Activities - Takes 1/3 of the row on large screens, full width on mobile */}
                  <div className="lg:col-span-1 order-1 lg:order-2">
                    <RecentActivities />
                  </div>
                </div>
              </div>
            )}

            {/* Projects Content */}
            {activeTab === 'projects' && (
              <div className="bg-white rounded-xl shadow-md p-4 lg:p-6">
                <h2 className="text-xl lg:text-2xl font-bold text-primary mb-4 lg:mb-6">
                  پروژه‌های دانشجویی
                </h2>
                <p className="text-gray-600 text-sm lg:text-base">
                  در این بخش می‌توانید تمامی پروژه‌های ارسال شده توسط دانشجویان
                  را مشاهده کنید.
                </p>
                {/* Project list would go here */}
              </div>
            )}

            {/* Evaluations Content */}
            {activeTab === 'evaluations' && (
              <div className="space-y-4 lg:space-y-6">
                <ProjectEvaluations />
              </div>
            )}

            {/* Students Content */}
            {activeTab === 'students' && (
              <div className="bg-white rounded-xl shadow-md p-4 lg:p-6">
                <h2 className="text-xl lg:text-2xl font-bold text-primary mb-4 lg:mb-6">
                  لیست دانشجویان
                </h2>
                <p className="text-gray-600 text-sm lg:text-base">
                  در این بخش می‌توانید لیست دانشجویان و وضعیت پروژه‌های آن‌ها را
                  مشاهده کنید.
                </p>
                {/* Students list would go here */}
              </div>
            )}

            {/* Courses Content */}
            {activeTab === 'courses' && (
              <div className="bg-white rounded-xl shadow-md p-4 lg:p-6">
                <h2 className="text-xl lg:text-2xl font-bold text-primary mb-4 lg:mb-6">
                  دروس
                </h2>
                <p className="text-gray-600 text-sm lg:text-base">
                  در این بخش می‌توانید دروس و پروژه‌های مرتبط با هر درس را
                  مشاهده و مدیریت کنید.
                </p>
                {/* Courses list would go here */}
              </div>
            )}

            {/* Settings Content */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-xl shadow-md p-4 lg:p-6">
                <h2 className="text-xl lg:text-2xl font-bold text-primary mb-4 lg:mb-6">
                  تنظیمات
                </h2>
                <p className="text-gray-600 text-sm lg:text-base">
                  در این بخش می‌توانید تنظیمات مربوط به پروفایل و ترجیحات خود را
                  تغییر دهید.
                </p>
                {/* Settings form would go here */}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
