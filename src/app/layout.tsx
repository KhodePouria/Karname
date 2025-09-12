import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import localFont from 'next/font/local';
import {AuthProvider} from '@/contexts/AuthContext';
import Image from 'next/image';
import logo from './public/Logo.png';
import Link from 'next/link';

import Loginbtn from '@/components/Loginbtn';

const myFont = localFont({
  src: './assets/fonts/Kalameh-Regular.ttf',
});
const myFontBold = localFont({
  src: './assets/fonts/Kalameh-Bold.ttf',
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'کارنامه - پلتفرم مدیریت پروژه‌های دانشجویی',
  description:
    'پلتفرمی مدرن برای مدیریت و پیگیری پروژه‌های دانشجویی با هدف ساده‌سازی فرآیندها و افزایش کیفیت آموزش',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${myFont.className} antialiased`}>
        <AuthProvider>
          <header className="flex flex-row-reverse w-full h-fit bg-[#FFFFFF] shadow-lg sticky top-0 z-50 items-center justify-between px-4 py-2">
            <Link href={'/'}>
              <Image
                src={logo}
                alt="logo"
                width={60}
                height={60}
                className="object-contain"
              />
            </Link>

            <Loginbtn />
          </header>
          {children}
        </AuthProvider>
        <footer
          className={` bg-gray-900 text-white py-8 px-4 flex flex-col md:flex-row items-center justify-between`}
        >
          <div className="flex items-center mb-4 md:mb-0">
            <span className="ml-3 text-lg font-bold">Karnameh</span>
          </div>
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} PouriaX. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
