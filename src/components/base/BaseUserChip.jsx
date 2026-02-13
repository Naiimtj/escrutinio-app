import React from 'react';

const BaseUserChip = ({ user, ...props }) => {
  if (!user) return null;

  return (
    <div className="flex flex-row gap-2 items-center" {...props}>
      <img
        src={user.avatar}
        alt={user.name}
        className="w-8 h-8 rounded-full object-cover"
      />
      <div className="flex flex-col items-start">
        <div className="text-sm font-medium text-gray-900">{user.name}</div>
        <div className="text-xs text-gray-600">{user.email}</div>
      </div>
    </div>
  );
};

export default BaseUserChip;
