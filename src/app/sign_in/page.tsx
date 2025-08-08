'use client';
import Image from 'next/image';
import localFont from 'next/font/local';
import logo from '../public/Logo.png';
import line from '../public/Line.svg';
import Link from 'next/link';
import {useState} from 'react';

const myFontBold = localFont({
  src: '../assets/fonts/Kalameh-Bold.ttf',
});

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FFF7] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Left Side - Branding */}
        <div className="text-center lg:text-right space-y-8 animate-slideUp">
          <div className="space-y-6">
            <h2
              className={`${myFontBold.className} text-2xl lg:text-3xl text-primary font-black`}
            >
              خوش آمدید!
            </h2>
            <div className="flex justify-center lg:justify-start">
              <Image
                src={line}
                alt="line"
                width={300}
                height={20}
                className="h-4 w-96"
              />
            </div>
            <p className="text-lg text-[#556d9c] leading-relaxed max-w-md mx-auto lg:mx-0">
              به پلتفرم مدیریت پروژه‌های دانشجویی خوش آمدید. وارد حساب کاربری
              خود شوید و از امکانات پیشرفته استفاده کنید.
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-4 text-right">
            <div className="flex items-center justify-center lg:justify-end gap-3">
              <span className="text-[#556d9c]">مدیریت آسان پروژه‌ها</span>
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-secondary text-sm">✓</span>
              </div>
            </div>
            <div className="flex items-center justify-center lg:justify-end gap-3">
              <span className="text-[#556d9c]">پیگیری لحظه‌ای وضعیت</span>
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-secondary text-sm">✓</span>
              </div>
            </div>
            <div className="flex items-center justify-center lg:justify-end gap-3">
              <span className="text-[#556d9c]">پشتیبانی ۲۴ ساعته</span>
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-secondary text-sm">✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto animate-slideUp delay-200">
          <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10">
            <div className="text-center mb-8">
              <h3
                className={`${myFontBold.className} text-2xl lg:text-3xl text-primary font-black mb-4`}
              >
                ورود به حساب کاربری
              </h3>
              <p className="text-[#556d9c]">اطلاعات خود را وارد کنید</p>
            </div>

            <form className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-primary font-medium text-right"
                >
                  ایمیل دانشگاهی
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 text-primary border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-right"
                    placeholder="example@university.edu"
                    dir="ltr"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-gray-400">📧</span>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-primary font-medium text-right"
                >
                  رمز عبور
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 text-primary border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-right"
                    placeholder="رمز عبور خود را وارد کنید"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                  >
                    {showPassword ? '--' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <Link
                  href="/forgot-password"
                  className="text-primary hover:text-[#526a9b] transition-colors"
                >
                  رمز عبور را فراموش کرده‌اید؟
                </Link>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-[#556d9c]">مرا به خاطر بسپار</span>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                </label>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-primary hover:bg-[#526a9b] text-secondary font-black text-lg py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:cursor-pointer"
              >
                ورود
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-[#556d9c]">یا</span>
                </div>
              </div>

              {/* University Login */}
              <button
                type="button"
                className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-secondary font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 hover:cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                ورود با حساب گوگل
              </button>

              {/* Google Login */}

              {/* Sign Up Link */}
              <div className="text-center pt-4">
                <p className="text-[#556d9c]">
                  حساب کاربری ندارید؟{' '}
                  <Link
                    href="/sign_up"
                    className="text-primary hover:text-[#526a9b] font-medium transition-colors"
                  >
                    ثبت‌نام کنید
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
