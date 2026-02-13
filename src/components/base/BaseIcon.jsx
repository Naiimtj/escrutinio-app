import { useState } from 'react';
import { iconRegistry } from './icons';

const TooltipWrapper = ({
  children,
  tooltip,
  position,
  showDelay = 100,
  hideDelay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTimeout, setShowTimeout] = useState(null);
  const [hideTimeout, setHideTimeout] = useState(null);

  if (!tooltip) {
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
          className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg whitespace-nowrap pointer-events-none ${positionClasses[position]}`}
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

const BaseIcon = ({
  icon,
  size = 'md',
  color = '#000',
  className = '',
  onClick,
  tooltip,
  tooltipPosition = 'top',
  tooltipShowDelay = 100,
  tooltipHideDelay = 0,
  ...props
}) => {
  const IconComponent = iconRegistry[icon];

  const iconElement = IconComponent ? (
    <IconComponent
      size={size}
      color={color}
      className={`${className} cursor-pointer`}
      onClick={onClick}
      {...props}
    />
  ) : (
    (() => {
      const sizeClasses = {
        'x-small': 'text-xs',
        small: 'text-sm',
        md: 'text-base',
        large: 'text-lg',
        'x-large': 'text-xl',
        '2x-large': 'text-2xl',
      };

      return (
        <i
          className={`${icon} ${sizeClasses[size]} ${className}`}
          style={{ color, cursor: 'pointer' }}
          onClick={onClick}
          {...props}
        />
      );
    })()
  );

  return (
    <TooltipWrapper
      tooltip={tooltip}
      position={tooltipPosition}
      showDelay={tooltipShowDelay}
      hideDelay={tooltipHideDelay}
    >
      {iconElement}
    </TooltipWrapper>
  );
};

export default BaseIcon;
