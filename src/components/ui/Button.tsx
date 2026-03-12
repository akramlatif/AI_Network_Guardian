'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  let buttonStyle = 'text-white font-semibold rounded-md transition-colors duration-200 px-4 py-2';
  let bgStyle = 'bg-teal-500 hover:bg-teal-600';

  switch (variant) {
    case 'primary':
      bgStyle = 'bg-teal-500 hover:bg-teal-600';
      break;
    case 'secondary':
      bgStyle = 'bg-gray-600 hover:bg-gray-700';
      break;
    case 'accent':
      bgStyle = 'bg-gray-800 hover:bg-gray-900';
      break;
  }

  return (
    <button
      {...props}
      className={`${buttonStyle} ${bgStyle}`}
    >
      {children}
    </button>
  );
};

export default Button;
