'use client';
import Image from 'next/image';
import line from '../public/Line.svg';
import Link from 'next/link';
import {useState} from 'react';
import {useAuth} from '@/contexts/AuthContext';
import {useRouter} from 'next/navigation';
import {Eye, EyeClosed, Mail} from 'lucide-react';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {login} = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        router.push('/dashboard/' + email);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'خطا در ورود. دوباره تلاش کنید'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FFF7] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Left Side - Branding */}
        <div className="text-center lg:text-right space-y-8 animate-slideUp">
          <div className="space-y-6">
            <h2 className={` text-2xl lg:text-3xl text-primary font-black`}>
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
                className={` text-2xl lg:text-3xl text-primary font-black mb-4`}
              >
                ورود به حساب کاربری
              </h3>
              <p className="text-[#556d9c]">اطلاعات خود را وارد کنید</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
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
                    <Mail />
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
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary "
                  >
                    {showPassword ? <Eye /> : <EyeClosed />}
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

              {/* Error Message */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-right">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-[#526a9b] text-secondary font-black text-lg py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'در حال ورود...' : 'ورود'}
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
