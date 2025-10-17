import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  disabled?: boolean;
  helpText?: string;
  required?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  id,
  label,
  error,
  disabled = false,
  helpText,
  required = false,
  type = 'text',
  className,
  ...rest
}) => {
  const errorId = `${id}-error`;
  const helpId = `${id}-help`;

  const describedByIds = [];
  if (helpText) describedByIds.push(helpId);
  if (error) describedByIds.push(errorId);
  const ariaDescribedBy = describedByIds.length > 0 ? describedByIds.join(' ') : undefined;

  return (
    <div>
      <label htmlFor={id} className="block text-base font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input
        id={id}
        type={type}
        disabled={disabled}
        required={required} // set attribute HTML
        aria-invalid={!!error}
        aria-describedby={ariaDescribedBy}
        className={`w-full px-4 py-3 border rounded-md text-gray-900 focus:outline-none focus:ring-2 transition-colors duration-200 ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200 focus:ring-0'
            : error ? 'border-red-500 ring-red-500 focus:border-red-500' : 'bg-white border-blue-300 focus:ring-emerald-500 focus:border-emerald-500'} ${className || ''}`}
        {...rest}
      />

      {helpText && !error && (
        <p id={helpId} className="text-gray-500 text-sm mt-1">
          {helpText}
        </p>
      )}

      {error && (
        <p id={errorId} className="text-red-600 text-sm mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default TextInput;
