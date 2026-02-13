import React from 'react';
import BaseChip from './BaseChip';

const BaseStatusChip = ({ status, ...props }) => {
  const statusColorMap = {
    SUBMITTED: 'bg-blue-600',
    OPEN: 'bg-blue-600',
    APPROVED: 'bg-green-600',
    REJECTED: 'bg-red-600',
    PENDING: 'bg-green-50',
    DRAFT: 'bg-yellow-600',
    INITIAL: 'bg-cyan-600',
    DENIED: 'bg-red-600',
    COMPLETED: 'bg-green-600',
    RELEASED: 'bg-blue-600',
    ACCEPTED: 'bg-green-600',
    NEW: 'bg-blue-600',
  };

  const tooltipMap = {
    SUBMITTED: 'status.tooltip.submitted',
    APPROVED: 'status.tooltip.approved',
    REJECTED: 'status.tooltip.rejected',
    PENDING: 'status.tooltip.pending',
    DRAFT: 'status.tooltip.draft',
    OPEN: 'status.tooltip.open',
    INITIAL: 'status.tooltip.initial',
    DENIED: 'status.tooltip.denied',
    COMPLETED: 'status.tooltip.completed',
    RELEASED: 'status.tooltip.released',
    ACCEPTED: 'status.tooltip.accepted',
  };

  const statusDisplayMap = {
    SUBMITTED: 'status.submitted',
    APPROVED: 'status.approved',
    REJECTED: 'status.rejected',
    PENDING: 'status.pending',
    DRAFT: 'status.draft',
    OPEN: 'status.open',
    INITIAL: 'status.initial',
    DENIED: 'status.denied',
    COMPLETED: 'status.completed',
    RELEASED: 'status.released',
    ACCEPTED: 'status.accepted',
    NEW: 'status.new',
  };

  const colorClass = statusColorMap[status];
  const tooltip = tooltipMap[status];
  const displayKey = statusDisplayMap[status];

  return (
    <div title={tooltip} {...props}>
      <BaseChip
        label={displayKey}
        color="blue"
        variant="filled"
        className={`${colorClass} text-white`}
      />
    </div>
  );
};

export default BaseStatusChip;
