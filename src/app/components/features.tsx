'use client';
import Image from 'next/image';
import {motion} from 'framer-motion';
import heroPic from '../public/heroPic.png';
import clouds from '../public/clouds.svg';
import line from '../public/Line.svg';
import localFont from 'next/font/local';

const myFontBold = localFont({
  src: '../assets/fonts/Kalameh-Bold.ttf',
});

export default function Features() {
  return (
    <>
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
                    دانشجویان می‌توانند پروژه‌های خود را تنها با چند کلیک آپلود
                    کرده و وضعیت آن را لحظه‌به‌لحظه پیگیری کنند.
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
    </>
  );
}
