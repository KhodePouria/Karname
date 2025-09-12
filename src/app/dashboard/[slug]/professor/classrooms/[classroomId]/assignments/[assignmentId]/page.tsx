'use client';

import {useState, useEffect} from 'react';
import {useAuth} from '@/contexts/AuthContext';
import {useParams} from 'next/navigation';
import Link from 'next/link';

type Submission = {
  id: number;
  studentName: string;
  submissionDate: string;
  rating: number | null;
  feedback: string | null;
  projectUrl: string;
  studentId: number;
};

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
};

export default function AssignmentDetailPage() {
  const {user} = useAuth();
  const params = useParams();
  const classroomId = params.classroomId as string;
  const assignmentId = params.assignmentId as string;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingModal, setRatingModal] = useState<{
    show: boolean;
    submission: Submission | null;
  }>({show: false, submission: null});
  const [ratingData, setRatingData] = useState({
    rating: '',
    feedback: '',
  });

  useEffect(() => {
    if (assignmentId) {
      fetchAssignmentDetails();
      fetchSubmissions();
    }
  }, [assignmentId, user?.id]);

  const fetchAssignmentDetails = async () => {
    try {
      const response = await fetch(`/api/assignments/${assignmentId}`);
      const data = await response.json();

      if (data.success) {
        setAssignment(data.assignment);
      }
    } catch (error) {
      console.error('Error fetching assignment details:', error);
    }
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/assignments/${assignmentId}/submissions`
      );
      const data = await response.json();

      if (data.success) {
        setSubmissions(data.submissions);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRateSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingModal.submission) return;

    try {
      const response = await fetch(
        `/api/projects/${ratingModal.submission.id}/rate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rating: parseInt(ratingData.rating),
            feedback: ratingData.feedback,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSubmissions(
          submissions.map((sub) =>
            sub.id === ratingModal.submission!.id
              ? {
                  ...sub,
                  rating: parseInt(ratingData.rating),
                  feedback: ratingData.feedback,
                }
              : sub
          )
        );
        setRatingModal({show: false, submission: null});
        setRatingData({rating: '', feedback: ''});
        alert('امتیاز با موفقیت ثبت شد!');
      } else {
        alert('خطا در ثبت امتیاز: ' + data.error);
      }
    } catch (error) {
      console.error('Error rating submission:', error);
      alert('خطا در ثبت امتیاز');
    }
  };

  const openRatingModal = (submission: Submission) => {
    setRatingModal({show: true, submission});
    setRatingData({
      rating: submission.rating?.toString() || '',
      feedback: submission.feedback || '',
    });
  };

  if (!assignment) {
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
            href={`/dashboard/${user?.id}/professor/classrooms/${classroomId}`}
            className="text-primary hover:underline"
          >
            ← بازگشت به کلاس
          </Link>
        </div>

        {/* Assignment Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
              {assignment.title}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              کلاس: {assignment.classroom.name}
            </p>
          </div>

          <div className="mb-4">
            <p className="text-gray-700">{assignment.description}</p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span>
              📅 تاریخ ایجاد:{' '}
              {new Date(assignment.createdAt).toLocaleDateString('fa-IR')}
            </span>
            {assignment.dueDate && (
              <span>
                ⏰ مهلت تحویل:{' '}
                {new Date(assignment.dueDate).toLocaleDateString('fa-IR')}
              </span>
            )}
            <span>📋 {submissions.length} ارسال</span>
          </div>
        </div>

        {/* Rating Modal */}
        {ratingModal.show && ratingModal.submission && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
              <h2 className="text-xl font-bold mb-4">
                امتیازدهی - {ratingModal.submission.studentName}
              </h2>
              <form onSubmit={handleRateSubmission}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    امتیاز (از 0 تا 20) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={ratingData.rating}
                    onChange={(e) =>
                      setRatingData({...ratingData, rating: e.target.value})
                    }
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="مثال: 18"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    بازخورد (اختیاری)
                  </label>
                  <textarea
                    value={ratingData.feedback}
                    onChange={(e) =>
                      setRatingData({...ratingData, feedback: e.target.value})
                    }
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={4}
                    placeholder="نظرات و پیشنهادات خود را بنویسید..."
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      setRatingModal({show: false, submission: null})
                    }
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    ثبت امتیاز
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Submissions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            ارسال‌های دانشجویان
          </h2>

          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-500 mt-2">در حال بارگذاری...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                هنوز پروژه‌ای ارسال نشده
              </h3>
              <p className="text-gray-500">
                دانشجویان هنوز پروژه‌ای برای این تکلیف ارسال نکرده‌اند
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {submission.studentName}
                        </h3>
                        {submission.rating !== null && (
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                            امتیاز: {submission.rating}/20
                          </span>
                        )}
                      </div>

                      <div className="text-sm text-gray-500 mb-3">
                        تاریخ ارسال:{' '}
                        {new Date(submission.submissionDate).toLocaleDateString(
                          'fa-IR'
                        )}
                      </div>

                      {submission.feedback && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            بازخورد:
                          </p>
                          <p className="text-sm text-gray-600">
                            {submission.feedback}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <a
                        href={submission.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors text-center"
                      >
                        مشاهده پروژه
                      </a>
                      <button
                        onClick={() => openRatingModal(submission)}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors"
                      >
                        {submission.rating !== null
                          ? 'ویرایش امتیاز'
                          : 'امتیازدهی'}
                      </button>
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
