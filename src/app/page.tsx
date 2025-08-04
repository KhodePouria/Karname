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
          <button className="flex justify-center items-center bg-white rounded-xl text-primary border border-primary hover:cursor-pointer hover:bg-primary hover:text-[#e6ebf7] transition-all px-4 py-1">
            <span className="text-lg font-black select-none mb-2">عضویت</span>
          </button>
        </div>
      </header>
      {/* hero section */}
      <div className="w-full relative -translate-y-20">
        <section className="w-full grid grid-cols-12 sm:grid-cols-16 md:grid-cols-20 lg:grid-cols-24 xl:grid-cols-28 h-[130vh] overflow-hidden">
          {Array.from(Array(28 * 35), (_, index) => (
            <Tile key={index} />
          ))}
        </section>
        <div
          className={`pointer-events-none absolute inset-0 flex flex-col gap-5 items-center justify-center z-10 mb-10 ${myFontBold.className}`}
        >
          <motion.h1
            className="text-9xl text-primary font-black"
            initial={{opacity: 0, y: 50}}
            animate={{opacity: 1, y: -150}}
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
            animate={{opacity: 1, y: -150}}
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
      <motion.div
        className="relative -translate-y-96"
        initial={{y: 130}}
        whileInView={{y: 0}}
        viewport={{
          margin: '0px',
          once: false,
        }}
        transition={{duration: 1, ease: 'easeOut'}}
      >
        <Image
          src={clouds}
          width={1920}
          height={1080}
          alt="clouds"
          className="z-10 pointer-events-none w-full h-auto object-cover mb-100"
        ></Image>
        <div className="absolute left-4 lg:left-1/12 top-1/2 flex flex-col lg:flex-row gap-4 lg:gap-0 z-20 w-full lg:w-auto px-4 lg:px-0">
          <div className="w-full lg:w-auto flex justify-center lg:justify-start">
            <Image
              src={heroPic}
              alt="heroPic"
              width={720}
              height={720}
              className="w-full max-w-sm lg:max-w-none lg:w-auto h-auto"
            ></Image>
          </div>
          <div className="flex flex-col justify-center lg:pl-8 text-center lg:text-right">
            <p
              className={`${myFontBold.className} text-2xl md:text-3xl lg:text-4xl text-primary font-black mb-4`}
            >
              بارگذاری سریع و ساده پروژه‌ها
            </p>
            <div className="flex justify-center lg:justify-start">
              <Image
                src={line}
                alt="icon"
                width={500}
                height={50}
                className="mb-4 w-full max-w-xs lg:max-w-none "
              ></Image>
            </div>
            <div className="flex flex-col lg:flex-row-reverse items-center gap-4">
              <p className="text-lg md:text-xl lg:text-2xl text-primary max-w-md">
                دانشجویان می‌توانند پروژه‌های خود را تنها با چند کلیک آپلود کرده
                و وضعیت آن را لحظه‌به‌لحظه پیگیری کنند.
              </p>
              <Image
                src={upload}
                alt="icon"
                width={70}
                height={70}
                className="w-12 h-12 lg:w-auto lg:h-auto "
              ></Image>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
