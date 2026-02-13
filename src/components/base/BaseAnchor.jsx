import React from 'react';

const BaseAnchor = ({
  label,
  icon,
  href,
  size = 'md',
  variant = 'primary',
  className = '',
  tooltip,
  disabled = false,
  children,
  ...props
}) => {
  const getVariantClasses = () => {
    const variantMap = {
      primary: 'text-blue-600 hover:text-blue-700 hover:underline',
      secondary: 'text-gray-600 hover:text-gray-700 hover:underline',
      success: 'text-green-600 hover:text-green-700 hover:underline',
      danger: 'text-red-600 hover:text-red-700 hover:underline',
      warning: 'text-yellow-600 hover:text-yellow-700 hover:underline',
      info: 'text-cyan-600 hover:text-cyan-700 hover:underline',
      help: 'text-purple-600 hover:text-purple-700 hover:underline',
    };
    return variantMap[variant] || variantMap.primary;
  };

  const variantClasses = getVariantClasses();

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const getIconClass = () => {
    if (!icon) return '';
    return icon.startsWith('pi-') ? `pi ${icon}` : icon;
  };

  return (
    <a
      href={disabled ? undefined : href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 transition-colors ${variantClasses} ${
        sizeClasses[size]
      } ${!label ? 'px-2' : ''} ${
        disabled
          ? 'opacity-50 cursor-not-allowed pointer-events-none'
          : 'cursor-pointer'
      } ${className}`}
      title={tooltip}
      {...props}
    >
      {icon && <i className={getIconClass()} />}
      <span>{label || children}</span>
    </a>
  );
};

export default BaseAnchor;
