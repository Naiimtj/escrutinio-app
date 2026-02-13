import { v4 as uuid } from 'uuid';

const BaseCheckbox = ({
  label,
  value = false,
  checked,
  id,
  labelPosition = 'right',
  labelPlacement = 'end',
  disabled = false,
  onChange,
  children,
  color = 'primary',
  size = 'medium',
  className = '',
  labelClassName = '',
  ...rest
}) => {
  const inputId = id ? String(id) : uuid();
  const isChecked = checked !== undefined ? checked : value;

  const handleChange = (event) => {
    const newChecked = event.target.checked;

    if (onChange) {
      onChange(newChecked, {
        value: newChecked,
        id,
        event,
      });
    }
  };

  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6',
  };

  const colorClasses = {
    primary: 'accent-primary text-primary focus:ring-primary',
    secondary: 'accent-gray-600 text-gray-600 focus:ring-gray-500',
    error: 'accent-red-600 text-red-600 focus:ring-red-500',
    success: 'accent-success text-success focus:ring-success',
    warning: 'accent-yellow-600 text-yellow-600 focus:ring-yellow-500',
    info: 'accent-cyan-600 text-cyan-600 focus:ring-cyan-500',
  };

  const checkboxClasses = `
    ${sizeClasses[size] || sizeClasses.medium}
    ${colorClasses[color] || colorClasses.primary}
    ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
  `;

  if (label) {
    const placement = labelPosition === 'left' ? 'start' : labelPlacement;
    const flexOrder = placement === 'start' ? 'flex-row-reverse' : 'flex-row';

    return (
      <div className={`flex items-center ${className}`}>
        <label
          htmlFor={inputId}
          className={`flex items-center gap-2 ${flexOrder} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${labelClassName}`}
        >
          {placement === 'start' && (
            <span className="text-sm text-darkPrimary">{label}</span>
          )}
          <input
            type="checkbox"
            id={inputId}
            checked={isChecked}
            onChange={handleChange}
            disabled={disabled}
            className={checkboxClasses}
            {...rest}
          />
          {placement !== 'start' && (
            <span className="text-sm text-darkPrimary">{label}</span>
          )}
        </label>
        {children}
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        id={inputId}
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
        className={checkboxClasses}
        {...rest}
      />
      {children}
    </div>
  );
};

export default BaseCheckbox;
