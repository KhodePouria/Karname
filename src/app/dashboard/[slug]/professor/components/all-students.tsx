'use client';

import {useEffect, useMemo, useState} from 'react';
import {useAuth} from '@/contexts/AuthContext';
import {Search} from 'lucide-react';
import {nullable} from 'zod';

// Minimal shape from /api/projects?professorId=
type Project = {
  id: number;
  title: string;
  description?: string | null;
  sendDate: string; // ISO
  rating: number | null; // 0..20 or null
  isGraded: boolean;
  projectAddress: string | null;
  sender?: {
    id: number | string;
    name: string;
    studentNumber?: string | null;
  } | null;
};

type StudentRow = {
  id: number | string;
  name: string;
  studentNumber?: string | null;
  totalProjects: number;
  gradedProjects: number;
  avgRating: number | null; // out of 20
  lastActivity: string; // ISO
};

const AllStudents = () => {
  const {user} = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [query, setQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentRow | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/projects?professorId=${user.id}`);
        const data = await res.json();
        if (!res.ok || !data.success)
          throw new Error(data.error || 'خطا در دریافت اطلاعات');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rows: Project[] = (data.projects as any[]).map((p) => ({
          id: Number(p.id),
          title: p.title,
          description: p.description ?? null,
          sendDate: p.sendDate,
          rating: p.rating ?? null,
          isGraded: Boolean(p.isGraded),
          projectAddress: p.projectAddress ?? null,
          sender: p.sender
            ? {
                id: p.sender.id,
                name: p.sender.name,
                studentNumber: p.sender.studentNumber,
              }
            : p.senderId && p.senderName
              ? {
                  id: p.senderId,
                  name: p.senderName,
                  studentNumber: p.senderSnumber,
                }
              : null,
        }));
        setProjects(rows);
      } catch (e) {
        console.error(e);
        setError(e instanceof Error ? e.message : 'خطای نامشخص');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  const students = useMemo<StudentRow[]>(() => {
    const map = new Map<string | number, Project[]>();
    projects.forEach((p) => {
      const sid = p.sender?.id ?? 'unknown';
      if (!map.has(sid)) map.set(sid, []);
      map.get(sid)!.push(p);
    });

    const toRow = (sid: string | number, list: Project[]): StudentRow => {
      const name = list[0]?.sender?.name || 'نامشخص';
      const studentNumber = list[0]?.sender?.studentNumber || null;
      const total = list.length;
      const graded = list.filter((x) => x.rating !== null && x.isGraded).length;
      const ratedValues = list
        .filter((x) => x.rating !== null && x.isGraded)
        .map((x) => x.rating as number);
      const avg = ratedValues.length
        ? Math.round(
            (ratedValues.reduce((a, b) => a + b, 0) / ratedValues.length) * 10
          ) / 10
        : null; // out of 20
      const last = list
        .map((x) => x.sendDate)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];
      return {
        id: sid,
        name,
        studentNumber,
        totalProjects: total,
        gradedProjects: graded,
        avgRating: avg,
        lastActivity: last,
      };
    };

    return Array.from(map.entries())
      .filter(([sid]) => sid !== 'unknown')
      .map(([sid, list]) => toRow(sid, list))
      .sort(
        (a, b) =>
          new Date(b.lastActivity).getTime() -
          new Date(a.lastActivity).getTime()
      );
  }, [projects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) =>
      `${s.name} ${s.studentNumber ?? ''}`.toLowerCase().includes(q)
    );
  }, [students, query]);

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleString('fa-IR');
    } catch {
      return d;
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return '—';
    const parts = name.trim().split(/\s+/);
    return parts
      .map((p) => p.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const ScoreBadge20 = ({value}: {value: number | null}) => {
    if (value === null) return <span className="text-gray-400">—</span>;
    const score = Math.max(0, Math.min(20, value));
    const color =
      score >= 16
        ? 'bg-green-100 text-green-800'
        : score >= 12
          ? 'bg-yellow-100 text-yellow-800'
          : 'bg-red-100 text-red-800';
    const shown =
      score % 1 === 0 ? Math.trunc(score) : Math.round(score * 10) / 10;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>
        {shown}/20
      </span>
    );
  };

  const StudentProjectsPanel = ({student}: {student: StudentRow}) => {
    const list = projects
      .filter((p) => `${p.sender?.id}` === `${student.id}`)
      .sort(
        (a, b) =>
          new Date(b.sendDate).getTime() - new Date(a.sendDate).getTime()
      );

    return (
      <div
        className="fixed inset-y-0 left-0 right-0 bg-black/40 z-50 flex justify-end"
        onClick={() => setSelectedStudent(null)}
      >
        <div
          className="w-full max-w-3xl h-full bg-white shadow-2xl p-6 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">
                {getInitials(student.name)}
              </div>
              <div>
                <div className="font-bold text-lg">{student.name}</div>
                {student.studentNumber && (
                  <div className="text-xs text-gray-500">
                    شماره دانشجویی: {student.studentNumber}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ScoreBadge20 value={student.avgRating} />
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:bg-gray-50"
              >
                بستن
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500">تعداد کل پروژه‌ها</div>
              <div className="text-xl font-bold">{student.totalProjects}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500">پروژه‌های ارزیابی‌شده</div>
              <div className="text-xl font-bold">{student.gradedProjects}</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 text-right">
                  <th className="px-4 py-3 text-gray-600">عنوان</th>
                  <th className="px-4 py-3 text-gray-600">تاریخ ارسال</th>
                  <th className="px-4 py-3 text-gray-600">وضعیت</th>
                  <th className="px-4 py-3 text-gray-600">امتیاز</th>
                  <th className="px-4 py-3 text-gray-600">دانلود</th>
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium">{p.title}</div>
                      {p.description && (
                        <div className="text-xs text-gray-500 truncate max-w-xs">
                          {p.description}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatDate(p.sendDate)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {p.isGraded ? (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          بررسی شده
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                          در انتظار
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <ScoreBadge20 value={p.rating} />
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={p.projectAddress || undefined}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors"
                      >
                        دانلود
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className=" rounded-xl p-4 lg:p-6">
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-lg font-bold text-primary lg:text-2xl">
          تمام دانشجویان
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="جستجو بر اساس نام یا شماره دانشجویی..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-72"
          />
          <span className="absolute left-2 top-1/2 -translate-y-1/2">
            <Search />
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-500 mt-3">در حال بارگذاری...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-600">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-500">دانشجویی یافت نشد</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-right">
                <th className="px-4 py-3 text-gray-600">دانشجو</th>
                <th className="px-4 py-3 text-gray-600">شماره دانشجویی</th>
                <th className="px-4 py-3 text-gray-600">میانگین نمره</th>
                <th className="px-4 py-3 text-gray-600">تعداد پروژه‌ها</th>
                <th className="px-4 py-3 text-gray-600">آخرین فعالیت</th>
                <th className="px-4 py-3 text-gray-600">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">
                        {getInitials(s.name)}
                      </div>
                      <div className="font-semibold">{s.name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {s.studentNumber ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <ScoreBadge20 value={s.avgRating} />
                  </td>
                  <td className="px-4 py-3">{s.totalProjects}</td>
                  <td className="px-4 py-3 text-sm">
                    {formatDate(s.lastActivity)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedStudent(s)}
                      className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors hover:-translate-y-0.5 shadow-sm"
                    >
                      مشاهده فعالیت‌ها
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedStudent && <StudentProjectsPanel student={selectedStudent} />}
    </div>
  );
};

export default AllStudents;
