import React from 'react';
import BaseTooltip from './BaseTooltip';

const BaseTooltipIcon = ({ tooltip, icon = 'pi-info-circle', ...props }) => {
  if (!tooltip) {
    return null;
  }

  return (
    <BaseTooltip tooltip={tooltip} icon={icon} {...props}>
      <button
        type="button"
        className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
      >
        <i className={`pi ${icon}`} />
      </button>
    </BaseTooltip>
  );
};

export default BaseTooltipIcon;
