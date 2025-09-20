'use client';
import Link from 'next/link';
import React, {useState, useRef, useEffect} from 'react';
import {useAuth} from '@/contexts/AuthContext';

const Loginbtn = () => {
  const {user, loading, logout} = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary/20 border-t-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Classes button (logged-in users) */}

      {!user && (
        <div className="flex gap-2 sm:flex-row sm:gap-3">
          <Link
            href={'/sign_in'}
            className="flex justify-center items-center bg-gradient-to-r from-primary to-primary/80 rounded-xl text-white hover:from-primary/90 hover:to-primary/70 active:from-primary/80 active:to-primary/60 transition-all duration-300 px-6 py-2.5 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span className="text-sm font-bold select-none sm:text-base">
              ورود
            </span>
          </Link>
          <Link
            href={'/sign_up'}
            className="flex justify-center items-center bg-white/80 backdrop-blur-sm rounded-xl text-primary border-2 border-primary/20 hover:bg-primary hover:text-white hover:border-primary active:bg-primary/90 transition-all duration-300 px-6 py-2.5 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span className="text-sm font-bold select-none sm:text-base">
              عضویت
            </span>
          </Link>
        </div>
      )}

      {user && (
        <div className="relative" ref={dropdownRef}>
          {/* User Profile Button */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 rounded-2xl px-4 py-2.5 hover: cursor-pointer"
          >
            {/* Avatar */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg -mt-3">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            </div>

            {/* User Info */}
            <div className="flex flex-col items-start">
              <span className="text-sm font-bold text-gray-800 leading-tight">
                {user.name}
              </span>
              <span className="text-xs text-primary/70 font-medium">
                {user.role === 'student' ? 'دانشجو' : 'استاد'}
              </span>
            </div>

            {/* Dropdown Arrow */}
            <svg
              className={`w-4 h-4 text-primary/60 transition-transform duration-300 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-4 w-60 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-300">
              {/* Dashboard Link */}
              <Link
                href={
                  user.role === 'student'
                    ? `/dashboard/${user.id}/student`
                    : `/dashboard/${user.id}/professor`
                }
                className="flex items-center gap-3 px-5 py-4 text-gray-700 hover:bg-primary/5 hover:text-primary transition-all duration-200 border-b border-gray-100/50"
                onClick={() => setIsDropdownOpen(false)}
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <svg
                    className="w-5 h-5 text-primary"
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
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">داشبورد</span>
                  <span className="text-xs text-gray-500">
                    مشاهده پنل کاربری
                  </span>
                </div>
              </Link>

              {/* Logout Button */}
              <button
                onClick={() => {
                  logout();
                  setIsDropdownOpen(false);
                }}
                className="flex items-center gap-3 px-5 py-4 text-red-600 hover:bg-red-50 transition-all duration-200 w-full text-right"
              >
                <div className="p-2 bg-red-100 rounded-lg">
                  <svg
                    className="w-5 h-5 text-red-600"
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
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">خروج</span>
                  <span className="text-xs text-red-400">
                    خروج از حساب کاربری
                  </span>
                </div>
              </button>
            </div>
          )}
        </div>
      )}
      {user && (
        <Link
          href={
            user.role === 'student'
              ? `/dashboard/${user.id}/student/classrooms`
              : `/dashboard/${user.id}/professor/classrooms`
          }
          className="group inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/40"
          title="کلاس‌ها"
          aria-label="کلاس‌ها"
        >
          <span className="text-lg">🎓</span>
          <span className="text-sm font-bold select-none hidden xs:inline sm:inline">
            کلاس‌ها
          </span>
          <span className="text-xl opacity-0 translate-x-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all hidden sm:inline">
            →
          </span>
        </Link>
      )}
    </div>
  );
};

export default Loginbtn;
