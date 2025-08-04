'use client';
import Image from 'next/image';
import localFont from 'next/font/local';
import logo from './public/Logo.png';
import cloud from './public/cloud.svg';
import {animate, motion} from 'framer-motion';
import Tile from './components/tile';

const myFontBold = localFont({
  src: './assets/fonts/Kalameh-Bold.ttf',
});

export default function Home() {
  return (
    <div className="flex flex-col h-[calc(1080*3)]">
      <header className="flex flex-row w-full h-fit bg-[#FFFFFF] shadow-lg sticky top-0 z-20 items-center justify-between px-4 py-2">
        <Image
          src={logo}
          alt="logo"
          width={180}
          height={180}
          className="object-contain"
        />

        <div className="flex flex-row gap-3">
          <button className="flex justify-center items-center bg-primary rounded-xl text-secondary hover:bg-[#526a9b] hover:cursor-pointer transition-all px-6 py-1">
            <span className="text-lg font-black select-none mb-2">ورود</span>
          </button>
          <button className="flex justify-center items-center bg-secondary rounded-xl text-primary border border-primary hover:cursor-pointer hover:bg-primary hover:text-[#e6ebf7] transition-all px-4 py-1">
            <span className="text-lg font-black select-none mb-2">عضویت</span>
          </button>
        </div>
      </header>
      {/* hero section */}
      <div className="w-full relative -translate-y-20">
        <section className="w-full grid grid-cols-20 h-screen overflow-y-clip">
          {Array.from(Array(20 * 14), (_, index) => (
            <Tile key={index} />
          ))}
        </section>
        <div
          className={`pointer-events-none absolute inset-0 flex flex-col gap-5 items-center justify-center z-10 mb-10 ${myFontBold.className}`}
        >
          <motion.h1
            className="text-9xl text-primary font-black"
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
            className="text-2xl text-[#556d9c] text-center"
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
    </div>
  );
}
