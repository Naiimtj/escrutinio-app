import { useState } from 'react';

const sizes = ['small', 'large'];
const types = ['button', 'submit', 'reset'];
const tooltipPositions = ['top', 'bottom', 'left', 'right'];

const getVariantClasses = (variant, outlined, text, disabled) => {
  if (disabled) {
    return 'bg-grayMedium text-grayDark cursor-not-allowed opacity-60';
  }

  if (text) {
    const textVariants = {
      primary: 'text-textPrimary hover:bg-lightPrimary/50',
      secondary: 'text-darkPrimary hover:bg-grayLight',
      success: 'text-darkGreen hover:bg-lightGreen/20',
      warning: 'text-warning hover:bg-warning/20',
      danger: 'text-alert hover:bg-alert/20',
      info: 'text-darkBlue hover:bg-lightBlue/20',
      help: 'text-grayDark hover:bg-grayLight',
    };
    return `bg-transparent ${textVariants[variant] || textVariants.primary}`;
  }

  if (outlined) {
    const outlinedVariants = {
      primary: 'border-2 border-primary text-textPrimary hover:bg-lightPrimary',
      secondary: 'border-2 border-grayMedium text-darkPrimary hover:bg-grayLight',
      success:
        'border-2 border-lightGreen text-darkGreen hover:bg-lightGreen/20',
      warning: 'border-2 border-warning text-warning hover:bg-warning/20',
      danger: 'border-2 border-alert text-alert hover:bg-alert/20',
      info: 'border-2 border-lightBlue text-darkBlue hover:bg-lightBlue/20',
      help: 'border-2 border-grayMedium text-grayDark hover:bg-grayLight',
    };
    return `bg-transparent ${outlinedVariants[variant] || outlinedVariants.primary}`;
  }

  const containedVariants = {
    primary: 'bg-primary text-darkPrimary hover:bg-darkPrimary hover:text-lightPrimary',
    secondary: 'bg-grayMedium text-darkPrimary hover:bg-grayDark hover:text-lightPrimary',
    success: 'bg-lightGreen text-lightPrimary hover:bg-darkGreen',
    warning: 'bg-warning text-warning hover:bg-warning/80',
    danger: 'bg-alert text-alert hover:bg-alert/80',
    info: 'bg-lightBlue text-darkPrimary hover:bg-darkPrimary hover:text-lightPrimary',
    help: 'bg-grayMedium text-grayDark hover:bg-grayDark hover:text-darkPrimary',
  };
  return containedVariants[variant] || containedVariants.primary;
};

const LoadingSpinner = ({ size = 16 }) => (
  <svg
    className="animate-spin"
    style={{ width: size, height: size }}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const TooltipWrapper = ({
  children,
  tooltip,
  position,
  disabled,
  showDelay = 100,
  hideDelay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTimeout, setShowTimeout] = useState(null);
  const [hideTimeout, setHideTimeout] = useState(null);

  if (!tooltip || disabled) {
    return children;
  }

  const handleMouseEnter = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }

    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, showDelay);
    setShowTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (showTimeout) {
      clearTimeout(showTimeout);
      setShowTimeout(null);
    }

    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, hideDelay);
    setHideTimeout(timeout);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900',
    bottom:
      'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900',
    right:
      'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900',
  };

  return (
    <div className="relative inline-block">
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {children}
      </div>
      {isVisible && (
        <div
          className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg whitespace-nowrap pointer-events-none ${
            positionClasses[position]
          }`}
        >
          {tooltip}
          <div
            className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}
          />
        </div>
      )}
    </div>
  );
};

export const BaseButton = ({
  label,
  type = types[0] || 'button',
  size = sizes[0] || 'small',
  className = '',
  loading = false,
  disabled = false,
  variant = 'primary',
  outlined = false,
  text = false,
  tooltip,
  tooltipPosition = tooltipPositions[0] || 'top',
  tooltipDisabled = false,
  tooltipShowDelay = 100,
  tooltipHideDelay = 0,
  children,
  onClick,
}) => {
  const hasPaddingOverride =
    className.includes('p-') ||
    className.includes('px-') ||
    className.includes('py-');

  const variantClasses = getVariantClasses(
    variant,
    outlined,
    text,
    disabled || loading,
  );

  const sizeClasses =
    size === 'large' ? 'px-6 py-3 text-lg font-semibold' : 'px-3 py-2 text-sm';

  const baseClasses = `
    inline-flex items-center justify-center gap-2 
    font-medium rounded-md
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
    disabled:cursor-not-allowed
    cursor-pointer
    ${hasPaddingOverride ? '' : sizeClasses}
    ${variantClasses}
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ');

  const contentButton = (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={baseClasses}
    >
      {loading && <LoadingSpinner size={size === 'large' ? 20 : 16} />}
      {label || children}
    </button>
  );

  return (
    <TooltipWrapper
      tooltip={tooltip}
      position={tooltipPosition}
      disabled={tooltipDisabled}
      showDelay={tooltipShowDelay}
      hideDelay={tooltipHideDelay}
    >
      {contentButton}
    </TooltipWrapper>
  );
};

export default BaseButton;
