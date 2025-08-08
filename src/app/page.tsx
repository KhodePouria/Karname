'use client';
import Image from 'next/image';
import localFont from 'next/font/local';
import logo from './public/Logo.png';
import clouds from './public/clouds.svg';
import {motion} from 'framer-motion';
import Tile from './components/tile';
import line from './public/Line.svg';
import heroPic from './public/heroPic.png';

import upload from './public/upload.svg';

import Link from 'next/link';
const myFontBold = localFont({
  src: './assets/fonts/Kalameh-Bold.ttf',
});

export default function Home() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <header className="flex flex-row w-full h-fit bg-[#FFFFFF] shadow-lg sticky top-0 z-50 items-center justify-between px-4 py-2">
          <Image
            src={logo}
            alt="logo"
            width={60}
            height={60}
            className="object-contain"
          />

          <div className="flex flex-row gap-3">
            <Link
              href={'/sign_in'}
              className="flex justify-center items-center bg-primary rounded-xl text-secondary hover:bg-[#526a9b] hover:cursor-pointer transition-all px-6 py-1"
            >
              <span className="text-lg font-black select-none mb-2">ورود</span>
            </Link>
            <Link
              href={'/sign_up'}
              className="flex justify-center items-center bg-white rounded-xl text-primary border border-primary hover:cursor-pointer hover:bg-primary hover:text-[#e6ebf7] transition-all px-4 py-1"
            >
              <span className="text-lg font-black select-none mb-2">عضویت</span>
            </Link>
          </div>
        </header>
        {/* hero section */}
        <section className="w-full relative">
          <section className="w-full grid grid-cols-12 sm:grid-cols-14 md:grid-cols-16 lg:grid-cols-18 xl:grid-cols-20 h-[100%] sm:h-[105%] overflow-hidden">
            {Array.from(Array(20 * 15), (_, index) => (
              <Tile key={index} />
            ))}
          </section>
          <div
            className={`pointer-events-none absolute inset-0 flex flex-col gap-5 items-center justify-start pt-80 z-10 ${myFontBold.className}`}
          >
            <motion.h1
              className="text-6xl md:text-6xl lg:text-9xl text-primary font-black text-center"
              initial={{opacity: 0, y: 50}}
              animate={{opacity: 1, y: 0}}
              transition={{
                duration: 0.8,
                ease: 'easeOut',
              }}
            >
              کارنامه
            </motion.h1>
            <motion.h3
              className="text-xl md:text-2xl lg:text-2xl text-[#556d9c] text-center px-4 max-w-4xl"
              initial={{opacity: 0, y: 50}}
              animate={{opacity: 1, y: 0}}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: 'easeOut',
              }}
            >
              فضایی برای اشتراک گذاری و بازبینی پروژه های دانشجویی
            </motion.h3>
          </div>
        </section>
        {/* Features section */}
        <section className="relative bg-white w-full py-16 md:py-24">
          <motion.div
            className="relative overflow-hidden"
            initial={{y: 0, opacity: 0}}
            whileInView={{y: -800, opacity: 1}}
            viewport={{
              margin: '300px',
              once: true,
            }}
            transition={{duration: 1.5, ease: 'easeOut'}}
          >
            <Image
              src={clouds}
              width={1920}
              height={1080}
              alt="clouds"
              className=" left-0 w-full h-auto object-cover pointer-events-none z-20"
            />

            <section className="top-1/2 h-auto w-full bg-white mt-[-1rem] z-20 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-64 py-8">
              <div className="flex flex-col w-full lg:flex-row items-center gap-8 lg:gap-16">
                {/* Hero Image */}
                <div className="flex-shrink-0 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl xl:max-w-2xl animate-slideUp">
                  <Image
                    src={heroPic}
                    alt="heroPic"
                    width={1080}
                    height={720}
                    className="w-full h-auto"
                  />
                </div>

                {/* Features Content */}
                <div className="flex-1 space-y-12">
                  {/* Feature 1 */}
                  <div className="text-center lg:text-right animate-slideUp">
                    <h3
                      className={`${myFontBold.className} text-xl sm:text-2xl md:text-3xl lg:text-4xl text-primary font-black mb-1`}
                    >
                      بارگذاری سریع و ساده پروژه‌ها
                    </h3>
                    <div className="flex justify-center lg:justify-end mb-2">
                      <Image
                        src={line}
                        alt="line"
                        width={100}
                        height={20}
                        className="h-4 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl"
                      />
                    </div>
                    <p className="text-lg sm:text-base md:text-lg lg:text-xl text-primary ">
                      دانشجویان می‌توانند پروژه‌های خود را تنها با چند کلیک
                      آپلود کرده و وضعیت آن را لحظه‌به‌لحظه پیگیری کنند.
                    </p>
                  </div>

                  {/* Feature 2 */}
                  <div className="text-center lg:text-right animate-slideUp delay-200">
                    <h3
                      className={`${myFontBold.className} text-xl sm:text-2xl md:text-3xl lg:text-4xl text-primary font-black mb-1`}
                    >
                      صرفه‌جویی در زمان و کاغذبازی
                    </h3>
                    <div className="flex justify-center lg:justify-end mb-2">
                      <Image
                        src={line}
                        alt="line"
                        width={100}
                        height={20}
                        className="h-4 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl"
                      />
                    </div>
                    <p className="text-lg sm:text-base md:text-lg lg:text-xl text-primary ">
                      دیگر نیازی به ارسال دستی فایل‌ها یا پیگیری‌های حضوری نیست؛
                      همه‌چیز آنلاین و در دسترس است.
                    </p>
                  </div>

                  {/* Feature 3 */}
                  <div className="text-center lg:text-right animate-slideUp delay-400">
                    <h3
                      className={`${myFontBold.className} text-xl sm:text-2xl md:text-3xl lg:text-4xl text-primary font-black mb-1`}
                    >
                      افزایش شفافیت و کاهش خطا
                    </h3>
                    <div className="flex justify-center lg:justify-end mb-2">
                      <Image
                        src={line}
                        alt="line"
                        width={100}
                        height={20}
                        className="h-4 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl"
                      />
                    </div>
                    <p className="text-lg sm:text-base md:text-lg lg:text-xl text-primary mb-10">
                      تمام مراحل ثبت، بررسی و تأیید پروژه‌ها به‌صورت دیجیتال ثبت
                      می‌شود تا از فراموشی یا اشتباهات جلوگیری شود.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            <Image
              src={clouds}
              width={1920}
              height={1080}
              alt="clouds"
              className=" rotate-180 w-full h-auto object-cover pointer-events-none z-20"
            />
          </motion.div>
        </section>
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
