# Karnameh - سیستم مدیریت پروژه‌های دانشجویی

## نصب و راه‌اندازی

### پیش‌نیازها
- Node.js نسخه 16 یا بالاتر
- npm یا yarn
- یک حساب کاربری در [Supabase](https://supabase.com)

### راه‌اندازی Supabase
1. وارد پنل [Supabase](https://app.supabase.com) شوید
2. یک پروژه جدید ایجاد کنید
3. از منوی Storage یک bucket جدید به نام `projects` ایجاد کنید
4. تنظیمات bucket را به صورت زیر تغییر دهید:
   - گزینه Public را فعال کنید
   - حداکثر سایز فایل را روی 100MB تنظیم کنید
5. از منوی Settings > API، مقادیر زیر را کپی کنید:
   - URL
   - anon key
   - service_role key (توجه: این کلید حساس است و نباید در سمت کلاینت استفاده شود)

### راه‌اندازی محیط پروژه
1. این مخزن را clone کنید
2. دستور `npm install` یا `yarn` را اجرا کنید تا وابستگی‌ها نصب شوند
3. فایل `.env.local` را در ریشه پروژه ایجاد کنید و متغیرهای محیطی زیر را در آن قرار دهید:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_database_connection_string
```
4. دستور `npm run dev` یا `yarn dev` را اجرا کنید تا سرور توسعه محلی اجرا شود

## رفع مشکلات متداول

### خطای Row Level Security در آپلود فایل
اگر با خطای "new row violates row-level security policy" مواجه شدید، موارد زیر را بررسی کنید:
1. اطمینان حاصل کنید که `SUPABASE_SERVICE_ROLE_KEY` را در فایل `.env.local` تنظیم کرده‌اید
2. مطمئن شوید که bucket با نام `projects` در Supabase ایجاد شده است
3. سرور را مجددا راه‌اندازی کنید تا متغیرهای محیطی جدید بارگذاری شوند

### مشکل دانلود فایل‌ها
اگر با مشکل در دانلود فایل‌ها مواجه شدید:
1. بررسی کنید که آدرس فایل در دیتابیس به درستی ذخیره شده باشد
2. مطمئن شوید که bucket در Supabase عمومی تنظیم شده باشد
3. اطمینان حاصل کنید که لینک‌های دانلود به درستی در کامپوننت‌های فرانت‌اند تنظیم شده‌اند
