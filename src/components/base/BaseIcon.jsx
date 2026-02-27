import { useState, useRef, useEffect } from 'react';
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
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const wrapperRef = useRef(null);

  const updatePosition = () => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    }
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
    }
  }, [isVisible]);

  if (!tooltip) {
    return children;
  }

  const handleMouseEnter = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }

    updatePosition();
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

  const getTooltipPosition = () => {
    const gap = 8; // 8px gap
    const positions = {
      top: {
        top: coords.top - gap,
        left: coords.left + coords.width / 2,
        transform: 'translate(-50%, -100%)',
      },
      bottom: {
        top: coords.top + coords.height + gap,
        left: coords.left + coords.width / 2,
        transform: 'translateX(-50%)',
      },
      down: {
        top: coords.top + coords.height + gap,
        left: coords.left + coords.width / 2,
        transform: 'translateX(-50%)',
      },
      left: {
        top: coords.top + coords.height / 2,
        left: coords.left - gap,
        transform: 'translate(-100%, -50%)',
      },
      right: {
        top: coords.top + coords.height / 2,
        left: coords.left + coords.width + gap,
        transform: 'translateY(-50%)',
      },
      topleft: {
        top: coords.top - gap,
        left: coords.left + coords.width,
        transform: 'translate(-100%, -100%)',
      },
      topright: {
        top: coords.top - gap,
        left: coords.left,
        transform: 'translateY(-100%)',
      },
      downleft: {
        top: coords.top + coords.height + gap,
        left: coords.left + coords.width,
        transform: 'translateX(-100%)',
      },
      downright: {
        top: coords.top + coords.height + gap,
        left: coords.left,
        transform: 'none',
      },
    };
    return positions[position] || positions.top;
  };

  const tooltipStyle = isVisible ? getTooltipPosition() : {};

  return (
    <>
      <div
        ref={wrapperRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>
      {isVisible && (
        <div
          className="fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg whitespace-nowrap pointer-events-none"
          style={tooltipStyle}
        >
          {tooltip}
        </div>
      )}
    </>
  );
};

const BaseIcon = ({
  icon,
  size = 'md',
  color = '#000',
  className = '',
  onClick,
  isClicked = false,
  tooltip,
  tooltipPosition = 'top',
  tooltipShowDelay = 100,
  tooltipHideDelay = 0,
  ...props
}) => {
  const IconComponent = iconRegistry[icon];
  const cursorClass = isClicked ? 'cursor-pointer' : '';

  const iconElement = IconComponent ? (
    <IconComponent
      size={size}
      color={color}
      className={`${className} ${cursorClass}`}
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
          className={`${icon} ${sizeClasses[size]} ${className} ${cursorClass}`}
          style={{ color }}
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
