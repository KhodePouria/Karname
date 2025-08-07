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
      <div className="w-full relative">
        <section className="w-full grid grid-cols-12 sm:grid-cols-16 md:grid-cols-20 lg:grid-cols-24 xl:grid-cols-28 h-screen overflow-hidden">
          {Array.from(Array(28 * 25), (_, index) => (
            <Tile key={index} />
          ))}
        </section>
        <div
          className={`pointer-events-none absolute inset-0 top-1/12 -translate-y-1/5 flex flex-col gap-5 items-center justify-center z-10 ${myFontBold.className}`}
        >
          <motion.h1
            className="text-4xl md:text-6xl lg:text-9xl text-primary font-black text-center"
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
            className="text-lg md:text-xl lg:text-2xl text-[#556d9c] text-center px-4 max-w-4xl"
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
      </div>

      {/* Features section */}
      <section className="relative bg-white py-16 md:py-24">
        <motion.div
          className="relative overflow-hidden"
          initial={{y: 0, opacity: 0}}
          whileInView={{y: -300, opacity: 1}}
          viewport={{
            margin: '100px',
            once: true,
          }}
          transition={{duration: 0.8, ease: 'easeOut'}}
        >
          <Image
            src={clouds}
            width={1920}
            height={1080}
            alt="clouds"
            className=" left-0 w-full h-auto object-cover pointer-events-none z-20"
          />

          <div className=" top-1/2 left-1/2 bg-white mt-[-1rem] z-20 container mx-auto px-4 md:px-8 lg:px-16">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
              {/* Hero Image */}
              <motion.div
                initial={{opacity: 0, y: -100}}
                whileInView={{opacity: 1, y: 0}}
                transition={{duration: 0.8, ease: 'easeOut'}}
                className="flex-shrink-0"
              >
                <Image
                  src={heroPic}
                  alt="heroPic"
                  width={720}
                  height={720}
                  className="w-full max-w-md lg:max-w-lg h-auto"
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
                    className={`${myFontBold.className} text-2xl md:text-3xl lg:text-4xl text-primary font-black mb-4`}
                  >
                    بارگذاری سریع و ساده پروژه‌ها
                  </h3>
                  <div className="flex justify-center lg:justify-end mb-4">
                    <Image
                      src={line}
                      alt="line"
                      width={100}
                      height={20}
                      className="h-4 w-[30rem]"
                    />
                  </div>
                  <p className="text-base md:text-lg lg:text-xl text-primary ">
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
                    className={`${myFontBold.className} text-2xl md:text-3xl lg:text-4xl text-primary font-black mb-4`}
                  >
                    صرفه‌جویی در زمان و کاغذبازی
                  </h3>
                  <div className="flex justify-center lg:justify-end mb-4">
                    <Image
                      src={line}
                      alt="line"
                      width={10}
                      height={20}
                      className="h-4 w-[30rem]"
                    />
                  </div>
                  <p className="text-base md:text-lg lg:text-xl text-primary ">
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
                    className={`${myFontBold.className} text-2xl md:text-3xl lg:text-4xl text-primary font-black mb-4`}
                  >
                    افزایش شفافیت و کاهش خطا
                  </h3>
                  <div className="flex justify-center lg:justify-end mb-4">
                    <Image
                      src={line}
                      alt="line"
                      width={100}
                      height={20}
                      className="h-4 w-[30rem]"
                    />
                  </div>
                  <p className="text-base md:text-lg lg:text-xl text-primary ">
                    تمام مراحل ثبت، بررسی و تأیید پروژه‌ها به‌صورت دیجیتال ثبت
                    می‌شود تا از فراموشی یا اشتباهات جلوگیری شود.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
