'use client';
import Image from 'next/image';
import localFont from 'next/font/local';
import logo from '../public/Logo.png';
import {motion} from 'framer-motion';
import line from '../public/Line.svg';
import Link from 'next/link';
import {useState} from 'react';

const myFontBold = localFont({
  src: '../assets/fonts/Kalameh-Bold.ttf',
});

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    year: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FFF7] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Left Side - Branding */}
        <motion.div
          className="text-center lg:text-right space-y-8"
          initial={{opacity: 0, x: -50}}
          animate={{opacity: 1, x: 0}}
          transition={{duration: 0.8, ease: 'easeOut'}}
        >
          <div className="flex items-center justify-center lg:justify-end gap-4 mb-8">
            <Image
              src={logo}
              alt="کارنامه"
              width={80}
              height={80}
              className="object-contain"
            />
            <h1
              className={`${myFontBold.className} text-4xl lg:text-5xl text-primary font-black`}
            >
              کارنامه
            </h1>
          </div>

          <div className="space-y-6">
            <h2
              className={`${myFontBold.className} text-2xl lg:text-3xl text-primary font-black`}
            >
              عضو خانواده کارنامه شوید!
            </h2>
            <div className="flex justify-center lg:justify-end">
              <Image
                src={line}
                alt="line"
                width={300}
                height={20}
                className="h-4 w-auto"
              />
            </div>
            <p className="text-lg text-[#556d9c] leading-relaxed max-w-md mx-auto lg:mx-0">
              با ثبت‌نام در کارنامه، به جمع هزاران دانشجوی موفق بپیوندید و تجربه
              جدیدی از مدیریت پروژه‌های دانشگاهی داشته باشید.
            </p>
          </div>

          {/* Benefits List */}
          <div className="space-y-4 text-right">
            <div className="flex items-center justify-center lg:justify-end gap-3">
              <span className="text-[#556d9c]">آپلود آسان پروژه‌ها</span>
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-secondary text-sm">🚀</span>
              </div>
            </div>
            <div className="flex items-center justify-center lg:justify-end gap-3">
              <span className="text-[#556d9c]">پیگیری هوشمند وضعیت</span>
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-secondary text-sm">📊</span>
              </div>
            </div>
            <div className="flex items-center justify-center lg:justify-end gap-3">
              <span className="text-[#556d9c]">ارتباط مستقیم با اساتید</span>
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-secondary text-sm">👥</span>
              </div>
            </div>
            <div className="flex items-center justify-center lg:justify-end gap-3">
              <span className="text-[#556d9c]">گزارش‌گیری پیشرفته</span>
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-secondary text-sm">📈</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-8">
            <div className="text-center">
              <div className="text-2xl font-black text-primary">۵۰۰۰+</div>
              <div className="text-sm text-[#556d9c]">پروژه ثبت شده</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-primary">۲۰۰۰+</div>
              <div className="text-sm text-[#556d9c]">دانشجوی فعال</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-primary">۹۸٪</div>
              <div className="text-sm text-[#556d9c]">رضایت کاربران</div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Sign Up Form */}
        <motion.div
          className="w-full max-w-lg mx-auto"
          initial={{opacity: 0, x: 50}}
          animate={{opacity: 1, x: 0}}
          transition={{duration: 0.8, ease: 'easeOut', delay: 0.2}}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10">
            <div className="text-center mb-8">
              <h3
                className={`${myFontBold.className} text-2xl lg:text-3xl text-primary font-black mb-4`}
              >
                ثبت‌نام در کارنامه
              </h3>
              <p className="text-[#556d9c]">
                اطلاعات دانشجویی خود را تکمیل کنید
              </p>
            </div>

            <form className="space-y-5">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="firstName"
                    className="block text-primary font-medium text-right"
                  >
                    نام
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-right"
                    placeholder="نام خود را وارد کنید"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="lastName"
                    className="block text-primary font-medium text-right"
                  >
                    نام خانوادگی
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-right"
                    placeholder="نام خانوادگی"
                  />
                </div>
              </div>

              {/* Student ID */}
              <div className="space-y-2">
                <label
                  htmlFor="studentId"
                  className="block text-primary font-medium text-right"
                >
                  شماره دانشجویی
                </label>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-right"
                  placeholder="۹۸۱۲۳۴۵۶"
                  dir="ltr"
                />
              </div>

              {/* Department and Year */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="department"
                    className="block text-primary font-medium text-right"
                  >
                    رشته تحصیلی
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-right"
                  >
                    <option value="">انتخاب کنید</option>
                    <option value="computer">مهندسی کامپیوتر</option>
                    <option value="electrical">مهندسی برق</option>
                    <option value="mechanical">مهندسی مکانیک</option>
                    <option value="civil">مهندسی عمران</option>
                    <option value="industrial">مهندسی صنایع</option>
                    <option value="math">ریاضی</option>
                    <option value="physics">فیزیک</option>
                    <option value="chemistry">شیمی</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="year"
                    className="block text-primary font-medium text-right"
                  >
                    سال ورود
                  </label>
                  <select
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-right"
                  >
                    <option value="">انتخاب کنید</option>
                    <option value="1400">۱۴۰۰</option>
                    <option value="1401">۱۴۰۱</option>
                    <option value="1402">۱۴۰۲</option>
                    <option value="1403">۱۴۰۳</option>
                    <option value="1404">۱۴۰۴</option>
                  </select>
                </div>
              </div>

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
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-right pl-12"
                    placeholder="example@university.edu"
                    dir="ltr"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-gray-400">📧</span>
                  </div>
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-right pl-12"
                      placeholder="رمز عبور قوی"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-primary font-medium text-right"
                  >
                    تکرار رمز عبور
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-right pl-12"
                      placeholder="تکرار رمز عبور"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                    >
                      {showConfirmPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-[#556d9c]">
                    <Link
                      href="/terms"
                      className="text-primary hover:text-[#526a9b] transition-colors"
                    >
                      شرایط و قوانین
                    </Link>{' '}
                    را می‌پذیرم
                  </span>
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                </label>
              </div>

              {/* Sign Up Button */}
              <motion.button
                type="submit"
                disabled={!acceptTerms}
                className={`w-full font-black text-lg py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg ${
                  acceptTerms
                    ? 'bg-primary hover:bg-[#526a9b] text-secondary'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                whileHover={acceptTerms ? {scale: 1.02} : {}}
                whileTap={acceptTerms ? {scale: 0.98} : {}}
              >
                ثبت‌نام
              </motion.button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-[#556d9c]">یا</span>
                </div>
              </div>

              {/* Google Sign Up */}
              <button
                type="button"
                className="w-full border-2 border-[#ea4335] text-[#ea4335] hover:bg-[#ea4335] hover:text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2"
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
                ثبت‌نام با حساب Google
              </button>

              {/* Sign In Link */}
              <div className="text-center pt-4">
                <p className="text-[#556d9c]">
                  قبلاً ثبت‌نام کرده‌اید؟{' '}
                  <Link
                    href="/sign_in"
                    className="text-primary hover:text-[#526a9b] font-medium transition-colors"
                  >
                    وارد شوید
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
