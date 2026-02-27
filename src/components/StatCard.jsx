const StatCard = ({ label, value, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    teal: 'bg-teal-50 text-teal-600',
    black: 'dark:bg-gray-700 bg-gray-100 dark:text-white',
  };

  return (
    <div className={`${colorClasses[color]} p-4 rounded-lg flex items-center justify-between `}>
      <p className="text-md text-gray-600 dark:text-gray-400">{label}</p>
      <p className={`text-2xl font-bold`}>
        {value}
      </p>
    </div>
  );
};

export default StatCard;
