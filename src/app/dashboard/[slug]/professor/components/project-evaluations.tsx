'use client';

import {useState, useEffect} from 'react';
import {useAuth} from '@/contexts/AuthContext';

type Project = {
  id: string;
  title: string;
  description: string;
  submissionDate: string;
  publishDate: string;
  student: string;
  studentId: string;
  major: string;
  projectAddress: string;
};

export default function ProjectEvaluations() {
  const {user} = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/projects?professorId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Convert API data to match component structure
            const formattedProjects = data.projects.map((project: any) => ({
              id: project.id.toString(),
              title: project.title,
              description: project.description,
              submissionDate: project.sendDate,
              publishDate: project.publishedDate,
              student: project.sender?.name || 'نامشخص',
              studentId: project.sender?.id.toString() || '',
              major: 'نامشخص', // This field isn't in our schema
              projectAddress: project.projectAddress,
            }));
            setProjects(formattedProjects);
          }
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user?.id]);
  const [evaluationForm, setEvaluationForm] = useState({
    rating: 5,
    feedback: '',
  });

  // Filter projects based on search query
  const filteredProjects = projects.filter((project) => {
    return (
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.studentId.includes(searchQuery) ||
      project.major.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSubmitEvaluation = async (projectId: string) => {
    try {
      const response = await fetch('/api/projects/professor/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          rating: evaluationForm.rating,
          feedback: evaluationForm.feedback,
        }),
      });

      if (response.ok) {
        // Remove the evaluated project from the list
        setProjects(projects.filter((p) => p.id !== projectId));
        setSelectedProject(null);

        // Reset form
        setEvaluationForm({
          rating: 5,
          feedback: '',
        });

        alert('ارزیابی با موفقیت ثبت شد!');
      } else {
        alert('خطا در ثبت ارزیابی');
      }
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      alert('خطا در ثبت ارزیابی');
    }
  };

  const getSelectedProject = () => {
    return projects.find((p) => p.id === selectedProject);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 lg:p-6">
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:justify-between lg:items-center">
        <h2 className="text-lg font-bold text-primary lg:text-2xl">
          ارزیابی پروژه‌ها
        </h2>
        <div className="relative w-full lg:w-auto">
          <input
            type="text"
            placeholder="جستجوی پروژه یا دانشجو..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary lg:w-64"
          />
          <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
            🔍
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-3">
        {/* Project List */}
        <div className="lg:col-span-1 lg:border-l lg:border-gray-200">
          <h3 className="font-bold mb-4 text-gray-700 text-sm lg:text-base">
            پروژه‌های در انتظار ارزیابی
          </h3>

          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-500 mt-2">در حال بارگذاری...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              هیچ پروژه‌ای یافت نشد
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedProject === project.id
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-gray-400'
                  }`}
                  onClick={() => setSelectedProject(project.id)}
                >
                  <h4 className="font-medium text-gray-800">{project.title}</h4>
                  <div className="text-sm text-gray-600 mt-1">
                    <div className="flex items-center">
                      <span>دانشجو:</span>
                      <span className="mr-1">{project.student}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      <span>تاریخ ارسال:</span>
                      <span className="mr-1">{project.submissionDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Project Preview & Evaluation Form */}
        <div className="lg:col-span-2">
          {selectedProject ? (
            <div>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-bold text-lg text-primary mb-2 lg:text-xl">
                  {getSelectedProject()?.title}
                </h3>

                <div className="grid grid-cols-1 gap-4 mb-4 lg:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-500">اطلاعات دانشجو</p>
                    <p className="text-gray-800">
                      <strong>نام:</strong> {getSelectedProject()?.student}
                    </p>
                    <p className="text-gray-800">
                      <strong>شماره دانشجویی:</strong>{' '}
                      {getSelectedProject()?.studentId}
                    </p>
                    <p className="text-gray-800">
                      <strong>رشته:</strong> {getSelectedProject()?.major}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">اطلاعات پروژه</p>
                    <p className="text-gray-800">
                      <strong>تاریخ ارسال:</strong>{' '}
                      {getSelectedProject()?.submissionDate}
                    </p>
                    <p className="text-gray-800">
                      <strong>فایل پروژه:</strong> موجود
                    </p>
                    <button className="mt-2 text-primary hover:underline">
                      دانلود فایل پروژه
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">توضیحات پروژه</p>
                  <p className="text-gray-800">
                    {getSelectedProject()?.description}
                  </p>
                </div>
              </div>

              {/* Evaluation Form */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3 text-sm lg:text-base">
                  ارزیابی پروژه
                </h3>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    امتیاز (از 1 تا 5)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() =>
                          setEvaluationForm({...evaluationForm, rating: star})
                        }
                        className={`text-xl lg:text-2xl ${evaluationForm.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="mr-2 text-sm lg:text-lg">
                      ({evaluationForm.rating})
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    بازخورد
                  </label>
                  <textarea
                    value={evaluationForm.feedback}
                    onChange={(e) =>
                      setEvaluationForm({
                        ...evaluationForm,
                        feedback: e.target.value,
                      })
                    }
                    rows={4}
                    placeholder="نظر خود را در مورد این پروژه بنویسید..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex justify-center lg:justify-end">
                  <button
                    onClick={() => handleSubmitEvaluation(selectedProject)}
                    className="w-full px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors lg:w-auto"
                  >
                    ثبت ارزیابی
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 lg:h-64 text-gray-500 text-sm lg:text-base text-center">
              برای ارزیابی، یک پروژه را از لیست انتخاب کنید
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
