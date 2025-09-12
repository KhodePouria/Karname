import Image from 'next/image';
import localFont from 'next/font/local';

import HeroSection from './components/hero';
import line from './public/Line.svg';
import Features from './components/features';
import LenisComponent from './components/lenis';

const myFontBold = localFont({
  src: './assets/fonts/Kalameh-Bold.ttf',
});

export default function Home() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <LenisComponent />

        {/* hero section */}
        <HeroSection />
        <Features />

        {/* How It Works Section */}
        <section className="relative bg-[#FFFFFF] py-16 md:py-24 -translate-y-[40rem]">
          <div className="container mx-auto px-4 md:px-8 lg:px-16">
            <div className="text-center mb-16 animate-slideUp">
              <h2
                className={`${myFontBold.className} text-3xl md:text-4xl lg:text-5xl text-primary font-black mb-6`}
              >
                چگونه کار می‌کند؟
              </h2>
              <div className="flex justify-center mb-6"></div>
              <p className="text-lg md:text-xl text-[#556d9c] max-w-3xl mx-auto">
                تنها با چند مرحله ساده، پروژه خود را ثبت کنید و از پیگیری آسان
                آن لذت ببرید
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Step 1 */}
              <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow animate-slideUp">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-black text-secondary">۱</span>
                </div>
                <h3
                  className={`${myFontBold.className} text-xl md:text-2xl text-primary font-black mb-4`}
                >
                  ثبت‌نام و ورود
                </h3>
                <p className="text-base md:text-lg text-[#556d9c] leading-relaxed">
                  با ایمیل دانشگاهی خود وارد شوید و پروفایل دانشجویی‌تان را
                  تکمیل کنید
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow animate-slideUp delay-200">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-black text-secondary">۲</span>
                </div>
                <h3
                  className={`${myFontBold.className} text-xl md:text-2xl text-primary font-black mb-4`}
                >
                  آپلود پروژه
                </h3>
                <p className="text-base md:text-lg text-[#556d9c] leading-relaxed">
                  فایل‌های پروژه خود را آپلود کرده و اطلاعات مربوطه را تکمیل
                  کنید
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow animate-slideUp delay-400">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-black text-secondary">۳</span>
                </div>
                <h3
                  className={`${myFontBold.className} text-xl md:text-2xl text-primary font-black mb-4`}
                >
                  پیگیری و دریافت نتیجه
                </h3>
                <p className="text-base md:text-lg text-[#556d9c] leading-relaxed">
                  وضعیت پروژه را پیگیری کنید و نتیجه نهایی را دریافت کنید
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Statistics Section */}
        <section className="relative bg-primary py-16 md:py-24 -translate-y-[30rem]">
          <div className="container mx-auto px-4 md:px-8 lg:px-16">
            <div className="text-center mb-16 animate-slideUp">
              <h2
                className={`${myFontBold.className} text-3xl md:text-4xl lg:text-5xl text-secondary font-black mb-6`}
              >
                آمار و اعداد
              </h2>
              <div className="flex justify-center mb-6">
                <div className="h-6 w-96 bg-secondary rounded-full"></div>
              </div>
              <p className="text-lg md:text-xl text-[#e6ebf7] max-w-3xl mx-auto">
                اعتماد هزاران دانشجو به پلتفرم کارنامه
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Stat 1 */}
              <div className="text-center animate-slideUp">
                <div className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary mb-2">
                  ۵۰۰۰+
                </div>
                <p className="text-lg md:text-xl text-[#e6ebf7] font-medium">
                  پروژه ثبت شده
                </p>
              </div>

              {/* Stat 2 */}
              <div className="text-center animate-slideUp delay-200">
                <div className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary mb-2">
                  ۲۰۰۰+
                </div>
                <p className="text-lg md:text-xl text-[#e6ebf7] font-medium">
                  دانشجوی فعال
                </p>
              </div>

              {/* Stat 3 */}
              <div className="text-center animate-slideUp delay-400">
                <div className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary mb-2">
                  ۹۸٪
                </div>
                <p className="text-lg md:text-xl text-[#e6ebf7] font-medium">
                  رضایت کاربران
                </p>
              </div>

              {/* Stat 4 */}
              <div className="text-center animate-slideUp delay-400">
                <div className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary mb-2">
                  ۲۴/۷
                </div>
                <p className="text-lg md:text-xl text-[#e6ebf7] font-medium">
                  پشتیبانی آنلاین
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Call to Action Section */}
        <section className="relative bg-[#FFFFFF] py-16 md:py-24 -translate-y-[20rem]">
          <div className="container mx-auto px-4 md:px-8 lg:px-16">
            <div className="text-center max-w-4xl mx-auto animate-slideUp">
              <h2
                className={`${myFontBold.className} text-3xl md:text-4xl lg:text-5xl text-primary font-black mb-6`}
              >
                آماده شروع هستید؟
              </h2>
              <div className="flex justify-center mb-8">
                <Image
                  src={line}
                  alt="line"
                  width={400}
                  height={20}
                  className="h-6 w-auto"
                />
              </div>
              <p className="text-lg md:text-xl text-[#556d9c] mb-12 leading-relaxed">
                همین حالا عضو جامعه دانشجویان کارنامه شوید و تجربه جدیدی از
                مدیریت پروژه‌هایتان داشته باشید
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="bg-primary hover:bg-[#526a9b] text-secondary font-black text-xl px-12 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg">
                  شروع کنید
                </button>
                <button className="bg-transparent border-2 border-primary hover:bg-primary hover:text-secondary text-primary font-black text-xl px-12 py-4 rounded-xl transition-all">
                  بیشتر بدانید
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
