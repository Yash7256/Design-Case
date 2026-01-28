import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  variant = 'default',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}: ButtonProps) {
  const baseStyles =
    'font-medium transition-colors inline-flex items-center justify-center rounded-lg';

  const variantStyles = {
    default:
      'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed',
    outline:
      'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed',
    ghost:
      'text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button className={classes} disabled={disabled} {...props} />
  );
}
