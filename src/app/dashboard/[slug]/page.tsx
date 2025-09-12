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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return null;
}
