'use client';
import Link from 'next/link';
import React from 'react';
import {useAuth} from '@/contexts/AuthContext';

const Loginbtn = () => {
  const {user, loading, logout} = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      {!user && (
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <Link
            href={'/sign_in'}
            className="flex justify-center items-center bg-primary rounded-lg text-white hover:bg-primary/90 active:bg-primary/80 transition-all duration-200 px-4 py-2 sm:px-6 sm:py-2.5 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
          >
            <span className="text-sm font-semibold select-none sm:text-base">
              ورود
            </span>
          </Link>
          <Link
            href={'/sign_up'}
            className="flex justify-center items-center bg-white rounded-lg text-primary border-2 border-primary hover:bg-primary hover:text-white active:bg-primary/90 transition-all duration-200 px-4 py-2 sm:px-6 sm:py-2.5 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
          >
            <span className="text-sm font-semibold select-none sm:text-base">
              عضویت
            </span>
          </Link>
        </div>
      )}
      {user && (
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 items-center">
          {/* User Info - Hidden on very small screens, shown as dropdown on mobile */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold text-sm">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700 lg:text-base">
              {user.name}
            </span>
          </div>

          {/* Dashboard Button */}
          <Link
            href={
              user.role === 'student'
                ? `/dashboard/${user.id}/student`
                : `/dashboard/${user.id}/professor`
            }
            className="flex justify-center items-center bg-primary rounded-lg text-white hover:bg-primary/90 active:bg-primary/80 transition-all duration-200 px-4 py-2 sm:px-5 sm:py-2.5 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 w-full sm:w-auto"
          >
            <svg
              className="w-4 h-4 ml-2 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            <span className="text-sm font-semibold select-none sm:text-base">
              داشبورد
            </span>
          </Link>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex justify-center items-center rounded-lg bg-red-500 hover:bg-red-600 active:bg-red-700 text-white transition-all duration-200 px-4 py-2 sm:px-5 sm:py-2.5 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 w-full sm:w-auto"
            title="خروج از حساب کاربری"
          >
            <svg
              className="w-4 h-4 ml-2 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="text-sm font-semibold select-none sm:text-base">
              خروج
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Loginbtn;
