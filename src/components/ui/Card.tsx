import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = false, ...props }: CardProps) {
  return (
    <div
      className={`bg-surface border border-text-muted/10 rounded-lg shadow-lg ${
        hover ? "hover:border-primary/30 transition-colors duration-200" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
