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
        <div className="text-center lg:text-right space-y-8 animate-slideUp">
          <div className="space-y-6">
            <h2
              className={`${myFontBold.className} text-2xl lg:text-3xl text-primary font-black`}
            >
              عضو خانواده کارنامه شوید!
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
              با ثبت‌نام در کارنامه، به جمع هزاران دانشجوی موفق بپیوندید و تجربه
              جدیدی از مدیریت پروژه‌های دانشگاهی داشته باشید.
            </p>
          </div>

          {/* Benefits List */}
          <div className="space-y-4 text-right">
            <div className="flex items-center justify-center lg:justify-end gap-3">
              <span className="text-[#556d9c]">آپلود آسان پروژه‌ها</span>
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-secondary text-sm">🚀</span>
              </div>
            </div>
            <div className="flex items-center justify-center lg:justify-end gap-3">
              <span className="text-[#556d9c]">پیگیری هوشمند وضعیت</span>
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-secondary text-sm">📊</span>
              </div>
            </div>
            <div className="flex items-center justify-center lg:justify-end gap-3">
              <span className="text-[#556d9c]">ارتباط مستقیم با اساتید</span>
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-secondary text-sm">👥</span>
              </div>
            </div>
            <div className="flex items-center justify-center lg:justify-end gap-3">
              <span className="text-[#556d9c]">گزارش‌گیری پیشرفته</span>
              <div className="w-6 h-6 flex items-center justify-center">
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
        </div>

        {/* Sign Up Form */}
        <div className="w-full max-w-lg mx-auto animate-slideUp delay-200">
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
                    className="w-full px-4 py-3 border-2 text-primary border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-right"
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
                    className="w-full px-4 py-3 border-2 text-primary border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-right"
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
                  className="w-full px-4 py-3 border-2 text-primary border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-right"
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
                    className="w-full px-4 py-3 border-2 text-primary border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-right"
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
                    className="w-full px-4 py-3 border-2 text-primary border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-right"
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
                    className="w-full px-4 py-3 border-2 text-primary border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-right pl-12"
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
                      className="w-full px-4 py-3 border-2 text-primary border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-right pl-12"
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
                      className="w-full px-4 py-3 border-2 text-primary border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-right pl-12"
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
              <button
                type="submit"
                disabled={!acceptTerms}
                className={`w-full font-black text-lg py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg ${
                  acceptTerms
                    ? 'bg-primary hover:bg-[#526a9b] text-secondary'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                ثبت‌نام
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
        </div>
      </div>
    </div>
  );
}
