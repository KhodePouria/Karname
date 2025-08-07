'use client';
import Image from 'next/image';
import localFont from 'next/font/local';
import logo from './public/Logo.png';
import clouds from './public/clouds.svg';
import {motion} from 'framer-motion';
import Tile from './components/tile';
import line from './public/Line.svg';
import clocklogo from './public/clock.svg';
import info from './public/info.svg';
import heroPic from './public/heroPic.png';
import Lenis from 'lenis';
import upload from './public/upload.svg';
import {useEffect} from 'react';
import {tr} from 'framer-motion/client';

const myFontBold = localFont({
  src: './assets/fonts/Kalameh-Bold.ttf',
});

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
    });

    lenis.on('scroll', (e) => {
      console.log(e);
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
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
          <button className="flex justify-center items-center bg-primary rounded-xl text-secondary hover:bg-[#526a9b] hover:cursor-pointer transition-all px-6 py-1">
            <span className="text-lg font-black select-none mb-2">ورود</span>
          </button>
          <button className="flex justify-center items-center bg-white rounded-xl text-primary border border-primary hover:cursor-pointer hover:bg-primary hover:text-[#e6ebf7] transition-all px-4 py-1">
            <span className="text-lg font-black select-none mb-2">عضویت</span>
          </button>
        </div>
      </header>

      {/* hero section */}
      <section className="w-full relative">
        <section className="w-full grid grid-cols-16 sm:grid-cols-16 md:grid-cols-20 lg:grid-cols-24 xl:grid-cols-28 h-[100%] sm:h-[105%] overflow-hidden">
          {Array.from(Array(28 * 25), (_, index) => (
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
              <motion.div
                initial={{opacity: 0, y: 100}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.8, ease: 'easeOut'}}
                className="flex-shrink-0 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl xl:max-w-2xl"
              >
                <Image
                  src={heroPic}
                  alt="heroPic"
                  width={1080}
                  height={720}
                  className="w-full h-auto"
                />
              </motion.div>

              {/* Features Content */}
              <div className="flex-1 space-y-12">
                {/* Feature 1 */}
                <motion.div
                  className="text-center lg:text-right"
                  initial={{opacity: 0, y: 100}}
                  whileInView={{opacity: 1, y: 0}}
                  transition={{delay: 0.2, duration: 0.6, ease: 'easeOut'}}
                  viewport={{once: true}}
                >
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
                    دانشجویان می‌توانند پروژه‌های خود را تنها با چند کلیک آپلود
                    کرده و وضعیت آن را لحظه‌به‌لحظه پیگیری کنند.
                  </p>
                </motion.div>

                {/* Feature 2 */}
                <motion.div
                  className="text-center lg:text-right"
                  initial={{opacity: 0, y: 100}}
                  whileInView={{opacity: 1, y: 0}}
                  transition={{delay: 0.4, duration: 0.6, ease: 'easeOut'}}
                  viewport={{once: true}}
                >
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
                </motion.div>

                {/* Feature 3 */}
                <motion.div
                  className="text-center lg:text-right"
                  initial={{opacity: 0, y: 100}}
                  whileInView={{opacity: 1, y: 0}}
                  transition={{delay: 0.6, duration: 0.6, ease: 'easeOut'}}
                  viewport={{once: true}}
                >
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
                </motion.div>
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
          <motion.div
            className="text-center mb-16"
            initial={{opacity: 0, y: 50}}
            whileInView={{opacity: 1, y: 0}}
            transition={{duration: 0.8, ease: 'easeOut'}}
            viewport={{once: true}}
          >
            <h2
              className={`${myFontBold.className} text-3xl md:text-4xl lg:text-5xl text-primary font-black mb-6`}
            >
              چگونه کار می‌کند؟
            </h2>
            <div className="flex justify-center mb-6"></div>
            <p className="text-lg md:text-xl text-[#556d9c] max-w-3xl mx-auto">
              تنها با چند مرحله ساده، پروژه خود را ثبت کنید و از پیگیری آسان آن
              لذت ببرید
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <motion.div
              className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              initial={{opacity: 0, y: 100}}
              whileInView={{opacity: 1, y: 0}}
              transition={{delay: 0.2, duration: 0.6, ease: 'easeOut'}}
              viewport={{once: true}}
            >
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-black text-secondary">۱</span>
              </div>
              <h3
                className={`${myFontBold.className} text-xl md:text-2xl text-primary font-black mb-4`}
              >
                ثبت‌نام و ورود
              </h3>
              <p className="text-base md:text-lg text-[#556d9c] leading-relaxed">
                با ایمیل دانشگاهی خود وارد شوید و پروفایل دانشجویی‌تان را تکمیل
                کنید
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              initial={{opacity: 0, y: 100}}
              whileInView={{opacity: 1, y: 0}}
              transition={{delay: 0.4, duration: 0.6, ease: 'easeOut'}}
              viewport={{once: true}}
            >
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-black text-secondary">۲</span>
              </div>
              <h3
                className={`${myFontBold.className} text-xl md:text-2xl text-primary font-black mb-4`}
              >
                آپلود پروژه
              </h3>
              <p className="text-base md:text-lg text-[#556d9c] leading-relaxed">
                فایل‌های پروژه خود را آپلود کرده و اطلاعات مربوطه را تکمیل کنید
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              initial={{opacity: 0, y: 100}}
              whileInView={{opacity: 1, y: 0}}
              transition={{delay: 0.6, duration: 0.6, ease: 'easeOut'}}
              viewport={{once: true}}
            >
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative bg-primary py-16 md:py-24 -translate-y-[30rem]">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <motion.div
            className="text-center mb-16"
            initial={{opacity: 0, y: 50}}
            whileInView={{opacity: 1, y: 0}}
            transition={{duration: 0.8, ease: 'easeOut'}}
            viewport={{once: true}}
          >
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
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Stat 1 */}
            <motion.div
              className="text-center"
              initial={{opacity: 0, scale: 0.8}}
              whileInView={{opacity: 1, scale: 1}}
              transition={{delay: 0.2, duration: 0.6, ease: 'easeOut'}}
              viewport={{once: true}}
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary mb-2">
                ۵۰۰۰+
              </div>
              <p className="text-lg md:text-xl text-[#e6ebf7] font-medium">
                پروژه ثبت شده
              </p>
            </motion.div>

            {/* Stat 2 */}
            <motion.div
              className="text-center"
              initial={{opacity: 0, scale: 0.8}}
              whileInView={{opacity: 1, scale: 1}}
              transition={{delay: 0.4, duration: 0.6, ease: 'easeOut'}}
              viewport={{once: true}}
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary mb-2">
                ۲۰۰۰+
              </div>
              <p className="text-lg md:text-xl text-[#e6ebf7] font-medium">
                دانشجوی فعال
              </p>
            </motion.div>

            {/* Stat 3 */}
            <motion.div
              className="text-center"
              initial={{opacity: 0, scale: 0.8}}
              whileInView={{opacity: 1, scale: 1}}
              transition={{delay: 0.6, duration: 0.6, ease: 'easeOut'}}
              viewport={{once: true}}
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary mb-2">
                ۹۸٪
              </div>
              <p className="text-lg md:text-xl text-[#e6ebf7] font-medium">
                رضایت کاربران
              </p>
            </motion.div>

            {/* Stat 4 */}
            <motion.div
              className="text-center"
              initial={{opacity: 0, scale: 0.8}}
              whileInView={{opacity: 1, scale: 1}}
              transition={{delay: 0.8, duration: 0.6, ease: 'easeOut'}}
              viewport={{once: true}}
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary mb-2">
                ۲۴/۷
              </div>
              <p className="text-lg md:text-xl text-[#e6ebf7] font-medium">
                پشتیبانی آنلاین
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative bg-[#FFFFFF] py-16 md:py-24 -translate-y-[20rem]">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{opacity: 0, y: 50}}
            whileInView={{opacity: 1, y: 0}}
            transition={{duration: 0.8, ease: 'easeOut'}}
            viewport={{once: true}}
          >
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
              همین حالا عضو جامعه دانشجویان کارنامه شوید و تجربه جدیدی از مدیریت
              پروژه‌هایتان داشته باشید
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{opacity: 0, y: 30}}
              whileInView={{opacity: 1, y: 0}}
              transition={{delay: 0.3, duration: 0.6, ease: 'easeOut'}}
              viewport={{once: true}}
            >
              <button className="bg-primary hover:bg-[#526a9b] text-secondary font-black text-xl px-12 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg">
                شروع کنید
              </button>
              <button className="bg-transparent border-2 border-primary hover:bg-primary hover:text-secondary text-primary font-black text-xl px-12 py-4 rounded-xl transition-all">
                بیشتر بدانید
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-secondary py-16">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <motion.div
              className="col-span-1 md:col-span-2 lg:col-span-1"
              initial={{opacity: 0, y: 50}}
              whileInView={{opacity: 1, y: 0}}
              transition={{duration: 0.6, ease: 'easeOut'}}
              viewport={{once: true}}
            >
              <div className="flex items-center mb-6">
                <Image
                  src={logo}
                  alt="کارنامه"
                  width={60}
                  height={60}
                  className="object-contain ml-3"
                />
                <h3
                  className={`${myFontBold.className} text-2xl lg:text-3xl font-black`}
                >
                  کارنامه
                </h3>
              </div>
              <p className="text-[#e6ebf7] leading-relaxed mb-6">
                پلتفرمی مدرن برای مدیریت و پیگیری پروژه‌های دانشجویی با هدف
                ساده‌سازی فرآیندها و افزایش کیفیت آموزش
              </p>
              <div className="flex space-x-4 space-x-reverse">
                <button className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-[#e6ebf7] transition-colors">
                  <span className="text-primary text-xl">📧</span>
                </button>
                <button className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-[#e6ebf7] transition-colors">
                  <span className="text-primary text-xl">📱</span>
                </button>
                <button className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-[#e6ebf7] transition-colors">
                  <span className="text-primary text-xl">🌐</span>
                </button>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{opacity: 0, y: 50}}
              whileInView={{opacity: 1, y: 0}}
              transition={{delay: 0.2, duration: 0.6, ease: 'easeOut'}}
              viewport={{once: true}}
            >
              <h4 className={`${myFontBold.className} text-xl font-black mb-6`}>
                دسترسی سریع
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-[#e6ebf7] hover:text-secondary transition-colors"
                  >
                    صفحه اصلی
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#e6ebf7] hover:text-secondary transition-colors"
                  >
                    درباره ما
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#e6ebf7] hover:text-secondary transition-colors"
                  >
                    خدمات
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#e6ebf7] hover:text-secondary transition-colors"
                  >
                    تماس با ما
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#e6ebf7] hover:text-secondary transition-colors"
                  >
                    راهنما
                  </a>
                </li>
              </ul>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{opacity: 0, y: 50}}
              whileInView={{opacity: 1, y: 0}}
              transition={{delay: 0.4, duration: 0.6, ease: 'easeOut'}}
              viewport={{once: true}}
            >
              <h4 className={`${myFontBold.className} text-xl font-black mb-6`}>
                خدمات
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-[#e6ebf7] hover:text-secondary transition-colors"
                  >
                    آپلود پروژه
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#e6ebf7] hover:text-secondary transition-colors"
                  >
                    پیگیری وضعیت
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#e6ebf7] hover:text-secondary transition-colors"
                  >
                    مدیریت کاربران
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#e6ebf7] hover:text-secondary transition-colors"
                  >
                    گزارش‌گیری
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#e6ebf7] hover:text-secondary transition-colors"
                  >
                    پشتیبانی ۲۴/۷
                  </a>
                </li>
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{opacity: 0, y: 50}}
              whileInView={{opacity: 1, y: 0}}
              transition={{delay: 0.6, duration: 0.6, ease: 'easeOut'}}
              viewport={{once: true}}
            >
              <h4 className={`${myFontBold.className} text-xl font-black mb-6`}>
                اطلاعات تماس
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="ml-3 mt-1">📍</span>
                  <span className="text-[#e6ebf7]">
                    یاسوج، دانشگاه دولتی یاسوج
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="ml-3">📞</span>
                  <span className="text-[#e6ebf7]">۰۲۱-۱۲۳۴۵۶۷۸</span>
                </li>
                <li className="flex items-center">
                  <span className="ml-3">✉️</span>
                  <span className="text-[#e6ebf7]">info@karnameh.ir</span>
                </li>
                <li className="flex items-center">
                  <span className="ml-3">🕒</span>
                  <span className="text-[#e6ebf7]">
                    شنبه تا پنج‌شنبه: ۸:۰۰ - ۱۷:۰۰
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <motion.div
            className="border-t border-[#526a9b] mt-12 pt-8"
            initial={{opacity: 0}}
            whileInView={{opacity: 1}}
            transition={{delay: 0.8, duration: 0.6, ease: 'easeOut'}}
            viewport={{once: true}}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-[#e6ebf7] text-sm md:text-base">
                Pouriax, all rights reserved 2025 ©
              </div>
              <div className="flex flex-wrap gap-6 text-sm md:text-base">
                <a
                  href="#"
                  className="text-[#e6ebf7] hover:text-secondary transition-colors"
                >
                  حریم خصوصی
                </a>
                <a
                  href="#"
                  className="text-[#e6ebf7] hover:text-secondary transition-colors"
                >
                  شرایط استفاده
                </a>
                <a
                  href="#"
                  className="text-[#e6ebf7] hover:text-secondary transition-colors"
                >
                  سیاست کوکی‌ها
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
