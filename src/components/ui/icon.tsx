import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const DefaultIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => {
  return (
    <svg 
      width={size * 1.05} 
      height={size} 
      viewBox="0 0 21 20" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle 
        opacity="0.5" 
        cx="10.4998" 
        cy="9.99996" 
        r="8.33333" 
        stroke="currentColor" 
        strokeWidth="1.5"
      />
      <path 
        d="M13 10L10.5 10M10.5 10L8 10M10.5 10L10.5 7.5M10.5 10L10.5 12.5" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
    </svg>
  );
};