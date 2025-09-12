'use client';

export default function StatsCards() {
  const stats = [
    {
      title: 'کل پروژه‌ها',
      value: '3',
      icon: '📁',
      color: 'bg-blue-100 text-blue-800',
    },
    {
      title: 'در انتظار بررسی',
      value: '1',
      icon: '⏳',
      color: 'bg-yellow-100 text-yellow-800',
    },
    {
      title: 'بررسی شده',
      value: '2',
      icon: '✅',
      color: 'bg-green-100 text-green-800',
    },
    {
      title: 'میانگین امتیاز',
      value: '4.8',
      icon: '⭐',
      color: 'bg-purple-100 text-purple-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-xl shadow-md flex items-center"
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color}`}
          >
            <span className="text-xl">{stat.icon}</span>
          </div>
          <div className="mr-4">
            <div className="text-sm text-gray-500">{stat.title}</div>
            <div className="text-2xl font-bold text-gray-700">{stat.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
