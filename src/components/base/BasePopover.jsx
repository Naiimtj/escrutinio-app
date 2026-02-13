import React, { useState, useRef, useEffect } from 'react';

const BasePopover = ({
  content,
  visible = false,
  position = 'bottom',
  trigger = 'click',
  onVisibleChange,
  children,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(visible);
  const popoverRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    setIsOpen(visible);
  }, [visible]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        triggerRef.current &&
        !popoverRef.current.contains(event.target) &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        if (onVisibleChange) {
          onVisibleChange(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onVisibleChange]);

  const handleTriggerClick = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onVisibleChange) {
      onVisibleChange(newState);
    }
  };

  const handleTriggerHover = (hover) => {
    if (trigger === 'hover') {
      setIsOpen(hover);
      if (onVisibleChange) {
        onVisibleChange(hover);
      }
    }
  };

  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
  };

  return (
    <div className="relative inline-block" {...props}>
      <div
        ref={triggerRef}
        onClick={handleTriggerClick}
        onMouseEnter={() => handleTriggerHover(true)}
        onMouseLeave={() => handleTriggerHover(false)}
      >
        {children}
      </div>

      {isOpen && (
        <div
          ref={popoverRef}
          className={`absolute ${positionClasses[position]} z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-max`}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default BasePopover;
