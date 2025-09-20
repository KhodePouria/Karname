'use client';

import {useEffect, useState, useCallback} from 'react';
import {useParams} from 'next/navigation';
import Link from 'next/link';
import {useAuth} from '@/contexts/AuthContext';

type Classroom = {
  id: number;
  name: string;
  description: string;
  professor: {id: number; name: string};
  memberCount: number;
  assignmentCount: number;
};

type Member = {
  id: number;
  name: string;
  studentNumber: string;
  major: string | null;
  joinedAt: string;
};

type Project = {
  id: number;
  title: string;
  description: string | null;
  sendDate: string;
  rating: number | null;
  isGraded: boolean;
  student: {id: number; name: string};
  assignment: {id: number; title: string} | null;
};

type Assignment = {
  id: number;
  title: string;
  description: string;
  dueDate: string | null;
  submissionCount: number;
  createdAt: string;
};

export default function StudentClassroomDetailPage() {
  const {user} = useAuth();
  const params = useParams();
  const classroomId = params.classroomId as string;

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!classroomId || !user?.id) return;
    fetchClassroom();
    fetchMembers();
    fetchProjects();
    fetchAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classroomId, user?.id]);

  const fetchClassroom = useCallback(async () => {
    try {
      const res = await fetch(`/api/classrooms/join?studentId=${user?.id}`);
      const data = await res.json();
      if (data.success) {
        const current = data.classrooms.find(
          (c: {id: number}) => c.id === parseInt(classroomId)
        );
        if (current) {
          setClassroom({
            id: current.id,
            name: current.name,
            description: current.description,
            professor: {id: 0, name: current.professor},
            memberCount: current.memberCount,
            assignmentCount: current.assignmentCount,
          });
        }
      }
    } catch (e) {
      console.error('Error fetching classroom', e);
    }
  }, [classroomId, user?.id]);

  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch(`/api/classrooms/${classroomId}/members`);
      const data = await res.json();
      if (data.success) {
        setMembers(
          data.members.map(
            (m: {
              id: number;
              name: string;
              studentNumber: string;
              major: string | null;
              joinedAt: string;
            }) => ({
              ...m,
              joinedAt: new Date(m.joinedAt).toISOString(),
            })
          )
        );
      }
    } catch (e) {
      console.error('Error fetching members', e);
    }
  }, [classroomId]);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch(`/api/classrooms/${classroomId}/projects`);
      const data = await res.json();
      if (data.success) setProjects(data.projects);
    } catch (e) {
      console.error('Error fetching projects', e);
    }
  }, [classroomId]);

  const fetchAssignments = useCallback(async () => {
    try {
      const res = await fetch(`/api/assignments?classroomId=${classroomId}`);
      const data = await res.json();
      if (data.success) setAssignments(data.assignments);
    } catch (e) {
      console.error('Error fetching assignments', e);
    } finally {
      setLoading(false);
    }
  }, [classroomId]);

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleString('fa-IR');
    } catch {
      return d;
    }
  };

  const ScoreBadge20 = ({value}: {value: number | null}) => {
    if (value === null) return <span className="text-gray-400">—</span>;
    const v = Math.max(0, Math.min(20, value));
    const rounded = Math.round(v * 10) / 10;
    const color =
      v >= 16
        ? 'bg-green-100 text-green-800'
        : v >= 12
          ? 'bg-yellow-100 text-yellow-800'
          : 'bg-red-100 text-red-800';
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>
        {`${rounded % 1 === 0 ? Math.trunc(rounded) : rounded}/20`}
      </span>
    );
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
            href={`/dashboard/${user?.id}/student/classrooms`}
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
                  👨‍🏫 {classroom.professor.name}
                </span>
                <span className="flex items-center gap-1">
                  👥 {classroom.memberCount} دانشجو
                </span>
                <span className="flex items-center gap-1">
                  📝 {classroom.assignmentCount} تکلیف
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Members */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">دانشجویان</h2>
            {members.length === 0 ? (
              <div className="text-gray-500 text-sm">دانشجویی وجود ندارد</div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {members.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between border rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">
                        {m.name
                          .split(' ')
                          .map((p) => p[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{m.name}</div>
                        <div className="text-xs text-gray-500">
                          {m.studentNumber} • {m.major ?? 'نامشخص'}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(m.joinedAt).toLocaleDateString('fa-IR')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Projects */}
          <div className="xl:col-span-2 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">پروژه‌ها</h2>
            {projects.length === 0 ? (
              <div className="text-gray-500 text-sm">پروژه‌ای وجود ندارد</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-right">
                      <th className="px-4 py-2 text-gray-600">عنوان</th>
                      <th className="px-4 py-2 text-gray-600">دانشجو</th>
                      <th className="px-4 py-2 text-gray-600">تاریخ ارسال</th>
                      <th className="px-4 py-2 text-gray-600">امتیاز</th>
                      <th className="px-4 py-2 text-gray-600">تکلیف</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((p) => (
                      <tr key={p.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="font-semibold">{p.title}</div>
                          {p.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {p.description}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">{p.student.name}</td>
                        <td className="px-4 py-3 text-sm">
                          {formatDate(p.sendDate)}
                        </td>
                        <td className="px-4 py-3">
                          <ScoreBadge20 value={p.rating} />
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {p.assignment?.title ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Assignments */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">تکالیف</h2>
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-500 mt-2">در حال بارگذاری...</p>
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-gray-500 text-sm">تکلیفی وجود ندارد</div>
          ) : (
            <div className="space-y-3">
              {assignments.map((a) => (
                <Link
                  key={a.id}
                  href={`/dashboard/${user?.id}/student/assignments/${a.id}`}
                  className="block border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm truncate">
                        {a.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {a.description}
                      </p>
                      {a.dueDate && (
                        <p className="text-xs text-gray-400 mt-1">
                          مهلت:{' '}
                          {new Date(a.dueDate).toLocaleDateString('fa-IR')}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(a.createdAt).toLocaleDateString('fa-IR')}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
