import React from 'react';

const BaseSelectedItemChip = ({
  deletable = true,
  image,
  icon,
  size = 'medium',
  rounded = 'medium',
  isValidImage = false,
  onRemove,
  children,
  ...props
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'text-xs p-1';
      case 'large':
        return 'text-lg p-3';
      default:
        return 'text-sm p-2';
    }
  };

  const getImageClass = () => {
    let baseClass = '';
    switch (size) {
      case 'small':
        baseClass = 'h-4 w-4';
        break;
      case 'large':
        baseClass = 'h-8 w-8';
        break;
      default:
        baseClass = 'h-6 w-6';
        break;
    }

    switch (rounded) {
      case 'full':
        return `${baseClass} rounded-full`;
      case 'none':
        return `${baseClass} rounded-none`;
      case 'small':
        return `${baseClass} rounded-sm`;
      case 'medium':
        return `${baseClass} rounded-md`;
      case 'large':
        return `${baseClass} rounded-lg`;
      default:
        return `${baseClass} rounded-md`;
    }
  };

  const containerClass = `flex flex-row items-center gap-2 line-clamp-1 text-white bg-black rounded-full cursor-default w-fit ${getSizeClass()}`;

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className={containerClass} {...props}>
      {/* Image slot */}
      {image ? (
        <img
          src={isValidImage ? image : image}
          alt="chip"
          className={getImageClass()}
        />
      ) : icon ? (
        <i className={`pi ${icon} mr-1`} />
      ) : null}

      {children}

      {deletable && (
        <button
          onClick={handleRemove}
          className="text-black hover:text-blue-600 transition-colors p-1 rounded-full bg-white flex items-center justify-center cursor-pointer ml-1"
          title="Remove"
        >
          <i className="pi pi-times text-sm" />
        </button>
      )}
    </div>
  );
};

export default BaseSelectedItemChip;
