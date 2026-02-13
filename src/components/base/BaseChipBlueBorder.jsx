const BaseChipBlueBorder = ({
  size = 'md',
  sizeNum,
  condition = true,
  label,
  icon,
  opacity = false,
  children,
  ...props
}) => {
  if (!condition) return null;

  const sizeClass = sizeNum
    ? `text-[${sizeNum}px]`
    : `text-${size}`;

  return (
    <div
      className={`flex flex-row items-center gap-2 line-clamp-1 text-gray-900 bg-gray-50 rounded-full cursor-default px-2 py-1 border border-blue-600 w-fit ${sizeClass}`}
      {...props}
    >
      {icon && (
        <div
          className={`relative justify-center items-center flex ${
            opacity ? 'opacity-10' : ''
          }`}
        >
          {opacity && (
            <div
              className={`absolute h-5 w-5 rounded-full bg-blue-600 opacity-10`}
            ></div>
          )}
          <i className={`pi ${icon} text-blue-600`} />
        </div>
      )}
      <span>{label}</span>
      {children}
    </div>
  );
};

export default BaseChipBlueBorder;
