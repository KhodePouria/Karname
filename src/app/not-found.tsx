'use client';
import Image from 'next/image';
import localFont from 'next/font/local';
import logo from './public/Logo.png';
import line from './public/Line.svg';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

const myFontBold = localFont({
  src: './assets/fonts/Kalameh-Bold.ttf',
});

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FFF7] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl text-center">
        {/* Animated 404 */}
        <div className="mb-12 animate-fadeIn">
          <div className="relative">
            {/* Large 404 */}
            <h1
              className={`${myFontBold.className} text-8xl md:text-9xl lg:text-[12rem] font-black text-primary opacity-20 select-none`}
            >
              ۴۰۴
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8 mb-12">
          <div className="space-y-6">
            <h2
              className={`${myFontBold.className} text-3xl md:text-4xl lg:text-5xl text-primary font-black`}
            >
              صفحه مورد نظر یافت نشد!
            </h2>

            <div className="flex justify-center">
              <Image
                src={line}
                alt="line"
                width={400}
                height={20}
                className="h-6 w-auto"
              />
            </div>

            <p className="text-lg md:text-xl text-[#556d9c] leading-relaxed max-w-2xl mx-auto">
              متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا ممکن است منتقل
              شده باشد. لطفاً آدرس را بررسی کنید یا از منوی زیر استفاده کنید.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link
            href="/"
            className="bg-primary hover:bg-[#526a9b] text-secondary font-black text-lg px-8 py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
          >
            <span>🏠</span>
            بازگشت به خانه
          </Link>

          <button
            onClick={() => router.back()}
            className="bg-transparent border-2 border-primary hover:bg-primary hover:text-secondary text-primary font-black text-lg px-8 py-3 rounded-xl transition-all flex items-center gap-2"
          >
            <span>↶</span>
            بازگشت به صفحه قبل
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-12 text-center">
          <p className="text-[#556d9c] mb-4">
            همچنان مشکل دارید؟ با تیم پشتیبانی ما در ارتباط باشید
          </p>
          <div className="flex justify-center gap-6">
            <a
              href="mailto:support@karnameh.ir"
              className="text-primary hover:text-[#526a9b] transition-colors flex items-center gap-2"
            >
              <span>📧</span>
              support@karnameh.ir
            </a>
            <a
              href="tel:+982112345678"
              className="text-primary hover:text-[#526a9b] transition-colors flex items-center gap-2"
            >
              <span>📞</span>
              ۰۲۱-۱۲۳۴۵۶۷۸
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
