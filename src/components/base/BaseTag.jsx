import React, { useState, useRef, useEffect } from 'react';

const BaseTag = ({
  label = '',
  deletable = false,
  editable = false,
  onDelete,
  onEdit,
  ...props
}) => {
  const [editionMode, setEditionMode] = useState(false);
  const [labelInput, setLabelInput] = useState(label);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editionMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editionMode]);

  const handleToggleEditionMode = () => {
    if (!editable) return;
    setEditionMode(!editionMode);
  };

  const handleUpdateLabel = () => {
    if (onEdit) {
      onEdit(labelInput);
    }
    setEditionMode(false);
  };

  const handleChange = (e) => {
    setLabelInput(e.target.value);
  };

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200 group"
      {...props}
    >
      {!editionMode ? (
        <span
          onClick={handleToggleEditionMode}
          className={editable ? 'cursor-pointer hover:opacity-80' : ''}
        >
          {label}
        </span>
      ) : (
        <input
          ref={inputRef}
          type="text"
          value={labelInput}
          onChange={handleChange}
          onBlur={handleUpdateLabel}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              handleUpdateLabel();
            }
          }}
          className="w-fit border-b border-gray-700 bg-transparent focus:outline-none text-blue-800"
          style={{ borderBottom: 'solid 1px #333' }}
        />
      )}

      {deletable && (
        <button
          onClick={() => onDelete && onDelete()}
          className="ml-1 text-blue-800 hover:text-blue-600 transition-colors"
        >
          <i className="pi pi-times text-xs" />
        </button>
      )}
    </div>
  );
};

export default BaseTag;
