'use client';

import {useAuth} from '@/contexts/AuthContext';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';

export default function DashboardPage() {
  const {user, loading} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(`/sign_in`);
      } else if (user.role === 'student') {
        router.push(`${user.id}/student`);
      } else if (user.role === 'professor') {
        router.push(`${user.id}/professor`);
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-50 via-white to-gray-100" />
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center">
            <div
              className="relative h-12 w-12"
              aria-label="loading"
              aria-live="polite"
            >
              <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
              <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
              <div className="absolute inset-2 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
            <p className="mt-6 text-sm text-gray-500">
              در حال آماده‌سازی داشبورد...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
