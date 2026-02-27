import { getIconSize } from '../../../utils/sizeIcon';

const RestoreIcon = ({
  size = 'md',
  color = 'currentColor',
  className = '',
  ...props
}) => {
  const iconSize = getIconSize(size);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M3 3v5h5" />
      <path d="M3.05 13a9 9 0 1 0 2.13-6.36L3 8" />
      <polyline points="12 7 12 12 16 14" />
    </svg>
  );
};

export default RestoreIcon;
