const BaseSpinner = ({ size = 'md', ...props }) => {

  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20',
    '3xl': 'w-24 h-24',
    '4xl': 'w-28 h-28',
  }

  return (
    <div {...props} className="flex flex-col items-center">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin`}
      />
    </div>
  );
};

export default BaseSpinner;
