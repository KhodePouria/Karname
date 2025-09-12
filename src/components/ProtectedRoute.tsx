'use client';

import {useAuth, UserRole} from '@/contexts/AuthContext';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallbackPath?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  fallbackPath = '/sign_in',
}: ProtectedRouteProps) {
  const {user, loading} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(fallbackPath);
        return;
      }

      if (requiredRole && user.role !== requiredRole) {
        // Redirect to appropriate dashboard based on user role
        if (user.role === 'student') {
          router.push('/student');
        } else if (user.role === 'professor') {
          router.push('/professor');
        }
        return;
      }
    }
  }, [user, loading, router, requiredRole, fallbackPath]);

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

  if (!user) {
    return null;
  }

  if (requiredRole && user.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
