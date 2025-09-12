'use client';

import {useState} from 'react';
import {useAuth} from '@/contexts/AuthContext';

export default function ProjectUpload() {
  const {user} = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check if file is a ZIP file
      if (file.type !== 'application/zip' && !file.name.endsWith('.zip')) {
        setMessage({
          type: 'error',
          text: 'لطفا فقط فایل‌های ZIP آپلود کنید. فرمت‌های مجاز: .zip',
        });
        e.target.value = ''; // Clear the input
        return;
      }

      // Check file size (max 50MB)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        setMessage({
          type: 'error',
          text: 'حجم فایل نباید بیشتر از 50 مگابایت باشد',
        });
        e.target.value = ''; // Clear the input
        return;
      }

      setFormData((prev) => ({...prev, file}));
      setMessage(null); // Clear any previous error messages
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validate form
    if (!formData.title || !formData.description || !formData.file) {
      setMessage({type: 'error', text: 'لطفا تمام فیلدها را پر کنید'});
      setLoading(false);
      return;
    }

    try {
      // Create FormData for file upload
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('file', formData.file);
      uploadData.append('studentId', user?.id || '');

      // Send to API endpoint
      const response = await fetch('/api/projects/upload', {
        method: 'POST',
        body: uploadData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage({
          type: 'success',
          text: 'پروژه با موفقیت آپلود شد و برای بررسی ارسال گردید',
        });
        setFormData({
          title: '',
          description: '',
          file: null,
        });

        // Reset file input
        const fileInput = document.querySelector(
          'input[type="file"]'
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        throw new Error(result.error || 'خطا در آپلود فایل');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setMessage({
        type: 'error',
        text: error.message || 'خطا در ارسال پروژه. لطفا دوباره تلاش کنید',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-primary mb-6">آپلود پروژه جدید</h2>

      {message && (
        <div
          className={`p-4 mb-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="title"
          >
            عنوان پروژه
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="عنوان پروژه خود را وارد کنید"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            توضیحات
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="توضیحات پروژه خود را وارد کنید"
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="file"
          >
            فایل پروژه (PDF یا ZIP)
          </label>
          <div className="relative">
            <input
              id="file"
              name="file"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.zip"
              className="hidden"
            />
            <label
              htmlFor="file"
              className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <div className="text-center">
                <div className="mt-2 text-sm text-gray-600">
                  {formData.file
                    ? formData.file.name
                    : 'برای آپلود کلیک کنید یا فایل را اینجا رها کنید'}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  PDF یا ZIP (حداکثر 10MB)
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'در حال ارسال...' : 'ارسال پروژه'}
          </button>
        </div>
      </form>
    </div>
  );
}
