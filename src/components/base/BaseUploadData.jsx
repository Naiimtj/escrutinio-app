import React, { useRef } from 'react';
import BaseButton from './BaseButton';

const BaseUploadData = ({
  acceptedFormats = ['.csv'],
  label,
  tooltip,
  size = 'sm',
  onUploadFile,
  ...props
}) => {
  const fileInputRef = useRef(null);

  const handleUploadData = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles && onUploadFile) {
      onUploadFile(Array.from(uploadedFiles));
    }
    // Reset input value for multiple uploads of same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayedTooltip =
    tooltip || `Accepted formats: ${acceptedFormats.join(', ')}`;
  const acceptString = acceptedFormats.join(',');

  return (
    <div {...props}>
      <BaseButton
        label={label || 'Upload'}
        icon="pi-upload"
        onClick={handleUploadData}
        tooltip={displayedTooltip}
        size={size}
      />

      <input
        ref={fileInputRef}
        id="upload-data"
        type="file"
        accept={acceptString}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        multiple
      />
    </div>
  );
};

export default BaseUploadData;
