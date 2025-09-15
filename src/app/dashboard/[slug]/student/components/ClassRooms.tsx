'use client';

import {useAuth} from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Classrooms() {
  const {user} = useAuth();

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl shadow-md p-8 h-full min-h-[300px] flex flex-col justify-center">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-indigo-200/30 blur-3xl" />

      <div className="relative z-10 text-center">
        <h2 className="text-2xl font-extrabold text-primary mb-2">کلاس‌ها</h2>
        <p className="text-sm text-gray-600 mb-6">
          به کلاس‌ها و تکالیف خود دسترسی پیدا کنید
        </p>
        <div className="flex justify-center">
          <Link
            href={`/dashboard/${user?.id}/student/classrooms`}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-l from-primary to-primary/80 text-white text-lg font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <span className="text-2xl">🎓</span>
            <span>ورود به کلاس‌ها</span>
            <span className="text-xl opacity-0 translate-x-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
