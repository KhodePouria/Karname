'use client';

import {useState, useEffect, useCallback} from 'react';
import {useAuth} from '@/contexts/AuthContext';
import {useParams} from 'next/navigation';
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
    professorId: number;
    professor: {
      id: number;
      name: string;
    };
  };
};

type Submission = {
  id: number;
  title: string;
  description: string;
  projectAddress: string;
  sendDate: string;
  rating: number | null;
  feedback: string | null;
  isGraded: boolean;
};

export default function StudentAssignmentPage() {
  const {user} = useAuth();
  const params = useParams();
  const assignmentId = params.assignmentId as string;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectAddress: '',
  });

  useEffect(() => {
    if (assignmentId) {
      fetchAssignmentAndSubmission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignmentId, user?.id]);

  const fetchAssignmentAndSubmission = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch assignment details
      const assignmentResponse = await fetch(
        `/api/assignments/${assignmentId}`
      );
      const assignmentData = await assignmentResponse.json();

      if (assignmentData.success) {
        setAssignment(assignmentData.assignment);
      }

      // Fetch existing submission if any
      const submissionResponse = await fetch(
        `/api/assignments/${assignmentId}/student-submission?studentId=${user?.id}`
      );
      const submissionData = await submissionResponse.json();

      if (submissionData.success && submissionData.submission) {
        setSubmission(submissionData.submission);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [assignmentId, user?.id]);

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          projectAddress: formData.projectAddress,
          assignmentId: parseInt(assignmentId),
          senderId: user?.id,
          publisherId: assignment?.classroom.professorId || 1,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setFormData({title: '', description: '', projectAddress: ''});
        setShowSubmitForm(false);
        fetchAssignmentAndSubmission();
        alert('پروژه با موفقیت ارسال شد!');
      } else {
        alert('خطا در ارسال پروژه: ' + data.error);
      }
    } catch (error) {
      console.error('Error submitting project:', error);
      alert('خطا در ارسال پروژه');
    }
  };

  const isOverdue = assignment?.dueDate
    ? new Date(assignment.dueDate) < new Date()
    : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-500 mt-4">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            تکلیف یافت نشد
          </h2>
          <p className="text-gray-500">
            این تکلیف موجود نیست یا دسترسی به آن ندارید.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Link
            href={`/dashboard/${user?.id}/student/classrooms`}
            className="text-primary hover:underline"
          >
            ← بازگشت به کلاس‌ها
          </Link>
        </div>

        {/* Assignment Details */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
              {assignment.title}
            </h1>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
              <span>📚 کلاس: {assignment.classroom.name}</span>
              <span>👨‍🏫 استاد: {assignment.classroom.professor.name}</span>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">شرح تکلیف:</h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {assignment.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1 text-gray-500">
              📅 تاریخ ایجاد:{' '}
              {new Date(assignment.createdAt).toLocaleDateString('fa-IR')}
            </span>
            {assignment.dueDate && (
              <span
                className={`flex items-center gap-1 ${
                  isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'
                }`}
              >
                ⏰ مهلت تحویل:{' '}
                {new Date(assignment.dueDate).toLocaleDateString('fa-IR')}
                {isOverdue && ' (منقضی شده)'}
              </span>
            )}
          </div>
        </div>

        {/* Submit Form Modal */}
        {showSubmitForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">ارسال پروژه</h2>
              <form onSubmit={handleSubmitProject}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    عنوان پروژه *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({...formData, title: e.target.value})
                    }
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="مثال: وب‌سایت فروشگاهی"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    توضیحات پروژه *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({...formData, description: e.target.value})
                    }
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={4}
                    placeholder="توضیح کاملی از پروژه‌تان بنویسید..."
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    آدرس پروژه *
                  </label>
                  <input
                    type="url"
                    value={formData.projectAddress}
                    onChange={(e) =>
                      setFormData({...formData, projectAddress: e.target.value})
                    }
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://example.com یا https://github.com/username/project"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    لینک مستقیم پروژه یا مخزن کد آن را وارد کنید
                  </p>
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowSubmitForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    ارسال پروژه
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Submission Status */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">وضعیت ارسال</h2>

          {submission ? (
            <div className="space-y-6">
              {/* Submitted Project Info */}
              <div className="border rounded-lg p-4 bg-green-50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      <h3 className="font-semibold text-gray-900">
                        پروژه ارسال شده
                      </h3>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      {submission.title}
                    </h4>
                    <p className="text-gray-700 mb-3">
                      {submission.description}
                    </p>
                    <div className="text-sm text-gray-500 mb-3">
                      تاریخ ارسال:{' '}
                      {new Date(submission.sendDate).toLocaleDateString(
                        'fa-IR'
                      )}
                    </div>
                    <a
                      href={submission.projectAddress}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      🔗 مشاهده پروژه
                    </a>
                  </div>
                </div>
              </div>

              {/* Grading Status */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  وضعیت نمره‌دهی
                </h3>

                {submission.isGraded ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                      <span className="font-medium text-gray-900">
                        نمره‌دهی شده
                      </span>
                    </div>

                    <div className="bg-primary/10 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-bold text-primary">
                          {submission.rating}/20
                        </span>
                        <span className="text-gray-600">امتیاز نهایی</span>
                      </div>

                      {submission.feedback && (
                        <div className="mt-3">
                          <h4 className="font-medium text-gray-900 mb-2">
                            بازخورد استاد:
                          </h4>
                          <p className="text-gray-700 bg-white rounded-lg p-3">
                            {submission.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-orange-600">
                    <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                    <span>در انتظار بررسی استاد</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                پروژه‌ای ارسال نکرده‌اید
              </h3>
              <p className="text-gray-500 mb-6">
                برای این تکلیف هنوز پروژه‌ای ارسال نکرده‌اید
              </p>

              {isOverdue ? (
                <div className="text-red-600 mb-4">
                  ⚠️ مهلت ارسال به پایان رسیده است
                </div>
              ) : (
                <button
                  onClick={() => setShowSubmitForm(true)}
                  className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  ارسال پروژه
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
