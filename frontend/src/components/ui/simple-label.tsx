import React from 'react';

export function Label({ className = '', children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={`flex items-center gap-2 text-sm leading-none font-medium select-none ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}