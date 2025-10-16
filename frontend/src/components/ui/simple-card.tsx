import React from 'react';

function Card({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-card text-card-foreground flex flex-col gap-6 rounded-xl border ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function CardTitle({ className = '', children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4
      className={`leading-none ${className}`}
      {...props}
    >
      {children}
    </h4>
  );
}

function CardContent({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`px-6 [&:last-child]:pb-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export { Card, CardHeader, CardTitle, CardContent };