'use client';

import {useState, useEffect, useCallback} from 'react';
import {useAuth} from '@/contexts/AuthContext';
import Link from 'next/link';

type Assignment = {
  id: number;
  title: string;
  description: string;
  dueDate: string | null;
  createdAt: string;
  classroom: {
    id: number;
    name: string;
  };
  hasSubmission: boolean;
  submissionRating: number | null;
};

type Classroom = {
  id: number;
  name: string;
  description: string;
  professor: {
    name: string;
  };
  joinedAt: string;
};

export default function StudentClassroomsPage() {
  const {user} = useAuth();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinCode, setJoinCode] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchClassrooms();
      fetchAssignments();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const fetchClassrooms = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/student-classrooms?studentId=${user?.id}`
      );
      const data = await response.json();

      if (data.success) {
        setClassrooms(data.classrooms);
      }
    } catch (error) {
      console.error('Error fetching classrooms:', error);
    }
  }, [user?.id]);

  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/student-assignments?studentId=${user?.id}`
      );
      const data = await response.json();

      if (data.success) {
        setAssignments(data.assignments);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const handleJoinClassroom = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/classrooms/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          joinCode: joinCode.toUpperCase(),
          studentId: user?.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setJoinCode('');
        setShowJoinForm(false);
        fetchClassrooms();
        fetchAssignments();
        alert('با موفقیت به کلاس پیوستید!');
      } else {
        alert('خطا در پیوستن به کلاس: ' + data.error);
      }
    } catch (error) {
      console.error('Error joining classroom:', error);
      alert('خطا در پیوستن به کلاس');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
              کلاس‌های من
            </h1>
            <p className="text-gray-600 mt-1">
              کلاس‌ها و تکالیف خود را مدیریت کنید
            </p>
          </div>
          <button
            onClick={() => setShowJoinForm(true)}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            + پیوستن به کلاس
          </button>
        </div>

        {/* Join Classroom Modal */}
        {showJoinForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">پیوستن به کلاس</h2>
              <form onSubmit={handleJoinClassroom}>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    کد پیوستن *
                  </label>
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-center text-lg tracking-wider"
                    placeholder="ABC123"
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    کد ۶ حرفی که استاد به شما داده است
                  </p>
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowJoinForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    پیوستن
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Classrooms */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                کلاس‌های من
              </h2>

              {classrooms.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🎓</div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    هنوز به کلاسی نپیوسته‌اید
                  </h3>
                  <p className="text-gray-500 mb-6">
                    از استاد خود کد پیوستن دریافت کنید و به کلاس بپیوندید
                  </p>
                  <button
                    onClick={() => setShowJoinForm(true)}
                    className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    پیوستن به کلاس
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {classrooms.map((classroom) => (
                    <Link
                      key={classroom.id}
                      href={`/dashboard/${user?.id}/student/classrooms/${classroom.id}`}
                      className="block border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {classroom.name}
                      </h3>
                      {classroom.description && (
                        <p className="text-gray-600 text-sm mb-3">
                          {classroom.description}
                        </p>
                      )}
                      <div className="text-xs text-gray-500">
                        <div>استاد: {classroom.professor.name}</div>
                        <div>
                          عضویت:{' '}
                          {new Date(classroom.joinedAt).toLocaleDateString(
                            'fa-IR'
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Assignments */}
          <div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                تکالیف اخیر
              </h2>

              {loading ? (
                <div className="text-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-gray-500 mt-2">در حال بارگذاری...</p>
                </div>
              ) : assignments.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-4xl mb-4">📝</div>
                  <p className="text-gray-500 text-sm">تکلیفی موجود نیست</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignments.slice(0, 5).map((assignment) => (
                    <Link
                      key={assignment.id}
                      href={`/dashboard/${user?.id}/student/assignments/${assignment.id}`}
                      className="block border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 text-sm truncate">
                            {assignment.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {assignment.classroom.name}
                          </p>
                          {assignment.dueDate && (
                            <p className="text-xs text-gray-400 mt-1">
                              مهلت:{' '}
                              {new Date(assignment.dueDate).toLocaleDateString(
                                'fa-IR'
                              )}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {assignment.hasSubmission ? (
                            <>
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                                ارسال شده
                              </span>
                              {assignment.submissionRating !== null && (
                                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                                  {assignment.submissionRating}/20
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">
                              در انتظار
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}

                  {assignments.length > 5 && (
                    <Link
                      href={`/dashboard/${user?.id}/student/assignments`}
                      className="block text-center text-primary hover:underline text-sm py-2"
                    >
                      مشاهده همه تکالیف
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
