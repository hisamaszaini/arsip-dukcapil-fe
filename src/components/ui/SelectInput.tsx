import React from 'react';

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

const SelectInput: React.FC<SelectInputProps> = ({
  id,
  label,
  error,
  disabled = false,
  required = false,
  className,
  children,
  ...rest
}) => {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="block text-base font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <select
        id={id}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        required={required}
        className={`w-full px-4 py-3 border rounded-md text-gray-900 focus:outline-none focus:ring-2 transition-colors duration-200
    ${disabled
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200 focus:ring-0'
            : error
              ? 'border-red-500 ring-red-500 focus:border-red-500'
              : 'bg-white border-blue-300 focus:ring-emerald-500 focus:border-emerald-500'
          } ${className || ''}`}
        {...rest}
      >
        {children}
      </select>
      {error && (
        <p id={errorId} className="text-red-600 text-sm mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default SelectInput;