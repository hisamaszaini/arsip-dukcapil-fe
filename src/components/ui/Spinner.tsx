import React from 'react';

interface SpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 40, color = 'white', className = '' }) => {
  return (
    <div
      className={`animate-spin rounded-full border-t-4 border-b-4 border-${color}/80 ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

export default Spinner;
