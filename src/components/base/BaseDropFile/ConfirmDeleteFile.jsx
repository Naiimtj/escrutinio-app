import React from 'react';
import BaseButton from '../BaseButton';
import BaseIcon from '../BaseIcon';

const ConfirmDeleteFile = ({
  onConfirm,
  onCancel,
  fileName = 'file',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-4 p-6" {...props}>
      <h3 className="text-lg font-semibold text-gray-900">
        Confirm File Deletion
      </h3>

      <p className="text-gray-700">
        Are you sure you want to delete{' '}
        <span className="font-medium">"{fileName}"</span>?
      </p>

      <p className="text-sm text-gray-600">This action cannot be undone.</p>

      <div className="flex gap-2 justify-end">
        <BaseButton label="Cancel" text onClick={onCancel} />
        <BaseButton label="Delete" variant="danger" onClick={onConfirm} />
      </div>
    </div>
  );
};

export default ConfirmDeleteFile;
