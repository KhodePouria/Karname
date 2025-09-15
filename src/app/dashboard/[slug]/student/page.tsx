'use client';

import {useEffect, useState} from 'react';
import Sidebar from './components/sidebar';
import StatsCards from './components/stats-cards';
import ClassRooms from './components/ClassRooms';
import ProjectsList from './components/projects-list';
import Notifications from './components/notifications';
import Leaderboard from './components/leaderboard';
import {toast} from 'sonner';

import ProtectedRoute from '@/components/ProtectedRoute';
import {useAuth} from '@/contexts/AuthContext';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const {user, updateUser} = useAuth();

  // Profile form state
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    major: '',
    year: '',
    currentPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    if (user) {
      const [fn = '', ln = ''] = (user.name || '').split(' ');
      setProfile({
        firstName: fn,
        lastName: ln,
        email: user.email || '',
        major: user.major || '',
        year: typeof user.year === 'number' ? String(user.year) : '',
        currentPassword: '',
        newPassword: '',
      });
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    try {
      setSaving(true);
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          id: user.id,
          role: 'student',
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          major: profile.major,
          year: profile.year ? parseInt(profile.year) : undefined,
          currentPassword: profile.currentPassword || undefined,
          newPassword: profile.newPassword || undefined,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.error || 'خطا در به‌روزرسانی پروفایل');
        return;
      }
      updateUser && updateUser(data.user);
      toast.success('پروفایل با موفقیت به‌روزرسانی شد');
      setProfile((p) => ({...p, currentPassword: '', newPassword: ''}));
    } catch (err) {
      toast.error('خطا در به‌روزرسانی پروفایل');
    } finally {
      setSaving(false);
    }
  };

  // Content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div className="mb-6">
              <StatsCards />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              <div className="h-full">
                <ClassRooms />
              </div>
              <div className="h-full">
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
            <form
              onSubmit={handleSaveProfile}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="md:col-span-2 flex items-center gap-4 pb-2">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl">👨‍🎓</span>
                </div>
                <div className="text-sm text-gray-500">
                  <div>شماره دانشجویی: {user?.studentNumber}</div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">نام</label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) =>
                    setProfile({...profile, firstName: e.target.value})
                  }
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  نام خانوادگی
                </label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) =>
                    setProfile({...profile, lastName: e.target.value})
                  }
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ایمیل</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({...profile, email: e.target.value})
                  }
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">رشته</label>
                <input
                  type="text"
                  value={profile.major}
                  onChange={(e) =>
                    setProfile({...profile, major: e.target.value})
                  }
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  سال ورود
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1300}
                  max={1600}
                  value={profile.year}
                  onChange={(e) =>
                    setProfile({...profile, year: e.target.value})
                  }
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="md:col-span-2 border-t pt-4 mt-2">
                <h3 className="font-semibold text-gray-800 mb-3">
                  تغییر رمز عبور (اختیاری)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      رمز عبور فعلی
                    </label>
                    <input
                      type="password"
                      value={profile.currentPassword}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="برای تغییر رمز لازم است"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      رمز عبور جدید
                    </label>
                    <input
                      type="password"
                      value={profile.newPassword}
                      onChange={(e) =>
                        setProfile({...profile, newPassword: e.target.value})
                      }
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="اختیاری"
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    const [fn = '', ln = ''] = (user?.name || '').split(' ');
                    setProfile({
                      firstName: fn,
                      lastName: ln,
                      email: user?.email || '',
                      major: user?.major || '',
                      year:
                        typeof user?.year === 'number'
                          ? String(user?.year)
                          : '',
                      currentPassword: '',
                      newPassword: '',
                    });
                  }}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={saving}
                >
                  بازنشانی
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-60"
                  disabled={saving}
                >
                  {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                </button>
              </div>
            </form>
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
