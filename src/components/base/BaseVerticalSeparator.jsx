import React from 'react';

const BaseVerticalSeparator = ({ ...props }) => {
  return (
    <div
      className="inline-block h-62.5 min-h-[1em] w-0.5 self-stretch bg-neutral-300 opacity-100 dark:opacity-50"
      {...props}
    />
  );
};

export default BaseVerticalSeparator;
