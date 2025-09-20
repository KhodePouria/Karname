'use client';
import Image from 'next/image';
import {motion} from 'framer-motion';
import clouds from '../public/clouds.svg';
import line from '../public/Line.svg';
import localFont from 'next/font/local';
import {useEffect, useState} from 'react';
//I don't know why but it doesn't work if I don't put this comment here
import {Player} from '@lottiefiles/react-lottie-player';
import animation1 from '../public/animation.json';
const myFontBold = localFont({
  src: '../assets/fonts/Kalameh-Bold.ttf',
});

export default function Features() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      {/* Features section */}
      <section className="relative bg-white w-full py-16 md:py-24">
        <motion.div
          className="relative overflow-hidden"
          initial={{y: 0, opacity: 0}}
          whileInView={{y: isMobile ? 0 : -300, opacity: 1}}
          viewport={{margin: '300px', once: true}}
          transition={{duration: 1.2, ease: 'easeOut'}}
        >
          <Image
            src={clouds}
            width={1920}
            height={1080}
            alt="clouds"
            className="left-0 w-full h-auto object-cover pointer-events-none select-none z-0"
            priority
          />

          <section className="relative z-10 top-1/2 h-auto w-full bg-white mt-[-1rem] px-4 sm:px-8 md:px-16 lg:px-32 xl:px-64 py-8">
            <div className="flex flex-col w-full lg:flex-row items-center gap-8 lg:gap-16">
              {/* Hero Image */}
              <div className="flex-shrink-0 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl xl:max-w-2xl animate-slideUp">
                <Player
                  autoplay
                  loop
                  src={animation1}
                  style={{height: 720, width: 1080, translate: '25%'}}
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
          {/* Bottom clouds - hidden on small to avoid overlap */}
          <Image
            src={clouds}
            width={1920}
            height={1080}
            alt="clouds"
            className="hidden md:block rotate-180 w-full h-auto object-cover pointer-events-none select-none z-0"
          />
        </motion.div>
      </section>
    </>
  );
}
