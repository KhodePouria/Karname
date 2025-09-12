'use client';

import {useState, useEffect} from 'react';
import {useAuth} from '@/contexts/AuthContext';
import Link from 'next/link';

type Classroom = {
  id: number;
  name: string;
  description: string;
  joinCode: string;
  memberCount: number;
  assignmentCount: number;
  createdAt: string;
};

export default function ClassroomsPage() {
  const {user} = useAuth();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchClassrooms();
  }, [user?.id]);

  const fetchClassrooms = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/classrooms?professorId=${user.id}`);
      const data = await response.json();

      if (data.success) {
        setClassrooms(data.classrooms);
      }
    } catch (error) {
      console.error('Error fetching classrooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClassroom = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) return;

    try {
      const response = await fetch('/api/classrooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          professorId: user.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setClassrooms([data.classroom, ...classrooms]);
        setFormData({name: '', description: ''});
        setShowCreateForm(false);
      } else {
        alert('خطا در ایجاد کلاس: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating classroom:', error);
      alert('خطا در ایجاد کلاس');
    }
  };

  const copyJoinCode = (joinCode: string) => {
    navigator.clipboard.writeText(joinCode);
    alert('کد پیوستن کپی شد!');
  };

  if (!user) {
    return <div>لطفا وارد شوید</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
                کلاس‌های من
              </h1>
              <p className="text-gray-600 mt-1">مدیریت کلاس‌ها و تکالیف خود</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              + ایجاد کلاس جدید
            </button>
          </div>
        </div>

        {/* Create Classroom Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">ایجاد کلاس جدید</h2>
              <form onSubmit={handleCreateClassroom}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    نام کلاس *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({...formData, name: e.target.value})
                    }
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="مثال: برنامه‌نویسی پیشرفته"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    توضیحات
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({...formData, description: e.target.value})
                    }
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                    placeholder="توضیح مختصری از کلاس..."
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    ایجاد کلاس
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Classrooms Grid */}
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-500 mt-4">در حال بارگذاری...</p>
          </div>
        ) : classrooms.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              هنوز کلاسی ایجاد نکرده‌اید
            </h2>
            <p className="text-gray-500 mb-6">
              کلاس جدید ایجاد کنید و دانشجویان را دعوت کنید
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              ایجاد اولین کلاس
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classrooms.map((classroom) => (
              <div
                key={classroom.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {classroom.name}
                  </h3>
                  <div
                    onClick={() => copyJoinCode(classroom.joinCode)}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm font-mono cursor-pointer hover:bg-primary/20 transition-colors"
                    title="کلیک کنید تا کپی شود"
                  >
                    {classroom.joinCode}
                  </div>
                </div>

                {classroom.description && (
                  <p className="text-gray-600 text-sm mb-4">
                    {classroom.description}
                  </p>
                )}

                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    👥 {classroom.memberCount} دانشجو
                  </span>
                  <span className="flex items-center gap-1">
                    📝 {classroom.assignmentCount} تکلیف
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/${user.id}/professor/classrooms/${classroom.id}`}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-center text-sm hover:bg-primary/90 transition-colors"
                  >
                    مدیریت کلاس
                  </Link>
                  <button
                    onClick={() => copyJoinCode(classroom.joinCode)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                  >
                    کپی کد
                  </button>
                </div>

                <div className="mt-3 text-xs text-gray-400">
                  ایجاد شده:{' '}
                  {new Date(classroom.createdAt).toLocaleDateString('fa-IR')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
