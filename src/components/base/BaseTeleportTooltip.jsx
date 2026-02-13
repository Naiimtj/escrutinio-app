import React, { useState, useRef, useEffect, useCallback } from 'react';

const BaseTeleportTooltip = ({
  tooltip,
  icon = 'pi pi-info-circle',
  position = 'top',
  topValue = 0,
  leftValue = 0,
  width,
  height,
  maxWidth = 400,
  maxHeight,
  marginTop = 0,
  marginRight = 0,
  marginBottom = 0,
  marginLeft = 0,
  children,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const activatorRef = useRef(null);
  const tooltipRef = useRef(null);

  const TOOLTIP_OFFSET = 8;

  const handleShowTooltip = () => {
    setIsVisible(true);
  };

  const handleHideTooltip = () => {
    setTimeout(() => {
      setIsVisible(false);
    }, 100);
  };

  const updateTooltipPosition = useCallback(() => {
    if (!activatorRef.current || !tooltipRef.current) return;

    const activatorRect = activatorRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    let top = topValue;
    let left = leftValue;

    const formatSize = (value) =>
      typeof value === 'number' ? `${value}px` : value;

    switch (position) {
      case 'top':
        top = activatorRect.top - tooltipRect.height - TOOLTIP_OFFSET;
        left =
          activatorRect.left + activatorRect.width / 2 - tooltipRect.width / 2;
        break;
      case 'bottom':
        top = activatorRect.bottom + TOOLTIP_OFFSET;
        left =
          activatorRect.left + activatorRect.width / 2 - tooltipRect.width / 2;
        break;
      case 'left':
        top =
          activatorRect.top + activatorRect.height / 2 - tooltipRect.height / 2;
        left = activatorRect.left - tooltipRect.width - TOOLTIP_OFFSET;
        break;
      case 'right':
        top =
          activatorRect.top + activatorRect.height / 2 - tooltipRect.height / 2;
        left = activatorRect.right + TOOLTIP_OFFSET;
        break;
    }

    setTooltipStyle({
      top: `${Math.max(0, top) + window.scrollY}px`,
      left: `${Math.max(0, left) + window.scrollX}px`,
      width: width ? formatSize(width) : 'auto',
      height: height ? formatSize(height) : 'auto',
      maxWidth: formatSize(maxWidth),
      maxHeight: maxHeight ? formatSize(maxHeight) : 'auto',
      marginTop: `${marginTop}px`,
      marginRight: `${marginRight}px`,
      marginBottom: `${marginBottom}px`,
      marginLeft: `${marginLeft}px`,
    });
  }, [
    position,
    topValue,
    leftValue,
    width,
    height,
    maxWidth,
    maxHeight,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
  ]);

  useEffect(() => {
    if (isVisible) {
      // Schedule position update after DOM is painted
      const updateTimer = requestAnimationFrame(() => {
        updateTooltipPosition();
      });

      const handleScroll = () => updateTooltipPosition();
      const handleResize = () => updateTooltipPosition();

      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleResize);

      return () => {
        cancelAnimationFrame(updateTimer);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isVisible, updateTooltipPosition]);

  if (!tooltip) {
    return (
      <div className="inline-block" {...props}>
        {children}
      </div>
    );
  }

  return (
    <div className="inline-block" {...props}>
      <div
        ref={activatorRef}
        className="inline-block"
        onMouseEnter={handleShowTooltip}
        onMouseLeave={handleHideTooltip}
      >
        {children || (
          <i className={`${icon} text-gray-600 ml-1 cursor-pointer`} />
        )}
      </div>

      {isVisible && tooltip && typeof window !== 'undefined' && (
        <div
          ref={tooltipRef}
          style={tooltipStyle}
          className="fixed z-[10100] bg-white text-black border border-gray-200 shadow-md px-3 py-2 rounded text-xs leading-relaxed pointer-events-none whitespace-pre-line"
        >
          {tooltip}
        </div>
      )}
    </div>
  );
};

export default BaseTeleportTooltip;
