'use client';

import {useState, useEffect, useCallback} from 'react';
import {useAuth} from '@/contexts/AuthContext';
import {useParams} from 'next/navigation';
import Link from 'next/link';
import {toast} from 'sonner';
import dynamic from 'next/dynamic';
// Persian calendar + locale for the date picker
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import DateObject from 'react-date-object';

const DatePicker = dynamic(() => import('react-multi-date-picker'), {
  ssr: false,
});
const TimePicker = dynamic(
  () => import('react-multi-date-picker/plugins/time_picker'),
  {ssr: false}
);

type Assignment = {
  id: number;
  title: string;
  description: string;
  dueDate: string | null;
  submissionCount: number;
  createdAt: string;
};

type Classroom = {
  id: number;
  name: string;
  description: string;
  joinCode: string;
  memberCount: number;
  assignmentCount: number;
};

export default function ClassroomDetailPage() {
  const {user} = useAuth();
  const params = useParams();
  const classroomId = params.classroomId as string;

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
  });
  const [dueDateValue, setDueDateValue] = useState<DateObject | null>(null);

  useEffect(() => {
    if (classroomId) {
      fetchClassroomDetails();
      fetchAssignments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classroomId, user?.id]);

  const fetchClassroomDetails = useCallback(async () => {
    try {
      const response = await fetch(`/api/classrooms?professorId=${user?.id}`);
      const data = await response.json();

      if (data.success) {
        const currentClassroom = data.classrooms.find(
          (c: Classroom) => c.id === parseInt(classroomId)
        );
        setClassroom(currentClassroom);
      }
    } catch (error) {
      console.error('Error fetching classroom details:', error);
    }
  }, [user?.id, classroomId]);

  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/assignments?classroomId=${classroomId}`
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
  }, [classroomId]);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Compose final ISO from selected Jalali date & time (picker plugin)
      const finalDue: string | null =
        dueDateValue && typeof dueDateValue.toDate === 'function'
          ? (dueDateValue.toDate() as Date).toISOString()
          : null;

      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          classroomId,
          dueDate: finalDue,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAssignments([data.assignment, ...assignments]);
        setFormData({title: '', description: '', dueDate: ''});
        setDueDateValue(null);
        setShowCreateForm(false);
      } else {
        toast.error('خطا در ایجاد تکلیف');
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast.error('خطا در ایجاد تکلیف');
    }
  };

  const copyJoinCode = (joinCode: string) => {
    navigator.clipboard.writeText(joinCode);
    toast.success('کد پیوستن کپی شد!');
  };

  if (!classroom) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-500 mt-4">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Link
            href={`/dashboard/${user?.id}/professor/classrooms`}
            className="text-primary hover:underline"
          >
            ← بازگشت به کلاس‌ها
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
                {classroom.name}
              </h1>
              {classroom.description && (
                <p className="text-gray-600 mt-2">{classroom.description}</p>
              )}
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  👥 {classroom.memberCount} دانشجو
                </span>
                <span className="flex items-center gap-1">
                  📝 {classroom.assignmentCount} تکلیف
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div
                onClick={() => copyJoinCode(classroom.joinCode)}
                className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-mono cursor-pointer hover:bg-primary/20 transition-colors text-center"
                title="کلیک کنید تا کپی شود"
              >
                کد پیوستن: {classroom.joinCode}
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                + تکلیف جدید
              </button>
            </div>
          </div>
        </div>

        {/* Create Assignment Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
              <h2 className="text-xl font-bold mb-4">ایجاد تکلیف جدید</h2>
              <form onSubmit={handleCreateAssignment}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    عنوان تکلیف *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({...formData, title: e.target.value})
                    }
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="مثال: پروژه طراحی وب‌سایت"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    توضیحات تکلیف *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({...formData, description: e.target.value})
                    }
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={4}
                    placeholder="توضیح کاملی از تکلیف، الزامات و معیارهای ارزیابی..."
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    تاریخ و ساعت پایان (اختیاری)
                  </label>
                  <div className="flex items-center gap-3">
                    <DatePicker
                      value={dueDateValue}
                      onChange={(val: DateObject | null) => {
                        setDueDateValue(val);
                        if (val && typeof val.toDate === 'function') {
                          const iso = (val.toDate() as Date).toISOString();
                          setFormData((prev) => ({...prev, dueDate: iso}));
                        } else {
                          setFormData((prev) => ({...prev, dueDate: ''}));
                        }
                      }}
                      calendar={persian}
                      locale={persian_fa}
                      format="YYYY/MM/DD HH:mm"
                      plugins={[
                        <TimePicker key="tp" position="bottom" hideSeconds />,
                      ]}
                      calendarPosition="bottom-right"
                      editable={false}
                      inputClass="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
                      placeholder="انتخاب تاریخ و ساعت پایان"
                    />
                    {dueDateValue && (
                      <button
                        type="button"
                        onClick={() => {
                          setDueDateValue(null);
                          setFormData((prev) => ({...prev, dueDate: ''}));
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                      >
                        پاک کردن
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    از تقویم شمسی تاریخ را انتخاب کنید و سپس ساعت را از پایین
                    انتخاب کنید. ثانیه‌ها پنهان هستند و زمان به‌صورت 24 ساعته
                    است.
                  </p>
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
                    ایجاد تکلیف
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Assignments */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">تکالیف کلاس</h2>

          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-500 mt-2">در حال بارگذاری...</p>
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                هنوز تکلیفی ایجاد نکرده‌اید
              </h3>
              <p className="text-gray-500 mb-6">
                تکلیف جدید ایجاد کنید تا دانشجویان پروژه‌های خود را ارسال کنند
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                ایجاد اولین تکلیف
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {assignment.title}
                      </h3>
                      <p className="text-gray-600 mt-1 mb-3">
                        {assignment.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span>
                          📅{' '}
                          {new Date(assignment.createdAt).toLocaleDateString(
                            'fa-IR'
                          )}
                        </span>
                        {assignment.dueDate && (
                          <span>
                            ⏰ مهلت:{' '}
                            {new Date(assignment.dueDate).toLocaleDateString(
                              'fa-IR'
                            )}
                          </span>
                        )}
                        <span>📋 {assignment.submissionCount} ارسال</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/dashboard/${user?.id}/professor/classrooms/${classroomId}/assignments/${assignment.id}`}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors"
                      >
                        مشاهده ارسال‌ها
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
