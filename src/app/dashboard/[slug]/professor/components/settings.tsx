'use client';

import React, {useState} from 'react';
import {useAuth} from '@/contexts/AuthContext';

const Settings = () => {
  const {user, updateUser} = useAuth();
  const [form, setForm] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    major: user?.major || '',
    year: user?.year || '',
    currentPassword: '',
    newPassword: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setForm((prev) => ({...prev, [name]: value}));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      setSaving(true);
      setMessage(null);
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          id: user.id,
          role: user.role,
          ...form,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.error || 'خطا در ذخیره تغییرات');

      // Update auth user display data
      updateUser?.({
        name: data.user.name,
        email: data.user.email,
        ...(user.role === 'student'
          ? {major: data.user.major, year: data.user.year}
          : {}),
      });

      setMessage({type: 'success', text: 'تغییرات با موفقیت ذخیره شد'});
      setForm((f) => ({...f, currentPassword: '', newPassword: ''}));
    } catch (err) {
      console.error(err);
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'خطای ناشناخته',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-primary mb-4">
        تنظیمات حساب کاربری
      </h2>

      {message && (
        <div
          className={`mb-4 rounded-lg px-4 py-2 ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm text-gray-700 mb-1">نام</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="نام"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              نام خانوادگی
            </label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="نام خانوادگی"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">ایمیل</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="example@mail.com"
            />
          </div>
          {user?.role === 'student' && (
            <>
              <div>
                <label className="block text-sm text-gray-700 mb-1">رشته</label>
                <input
                  name="major"
                  value={form.major}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="مهندسی نرم‌افزار"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  سال تحصیلی
                </label>
                <input
                  name="year"
                  value={form.year}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="4"
                />
              </div>
            </>
          )}
        </div>

        <div className="pt-4 border-t">
          <h3 className="font-semibold mb-2">تغییر رمز عبور</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                رمز عبور فعلی
              </label>
              <input
                type="password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={onChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                رمز عبور جدید
              </label>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={onChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            onClick={() =>
              setForm({
                firstName: user?.name?.split(' ')[0] || '',
                lastName: user?.name?.split(' ').slice(1).join(' ') || '',
                email: user?.email || '',
                major: user?.major || '',
                year: user?.year || '',
                currentPassword: '',
                newPassword: '',
              })
            }
          >
            بازنشانی
          </button>
          <button
            type="submit"
            disabled={saving}
            className={`px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
