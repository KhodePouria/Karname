'use client';
import {motion} from 'framer-motion';
import Tile from '../components/tile';
import localFont from 'next/font/local';

const myFontBold = localFont({
  src: '../assets/fonts/Kalameh-Bold.ttf',
});

function HeroSection() {
  return (
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
  );
}

export default HeroSection;
