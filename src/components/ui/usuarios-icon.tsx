import React from 'react';

interface UsuariosIconProps {
  className?: string;
  size?: number;
}

export const UsuariosIcon: React.FC<UsuariosIconProps> = ({ 
  className = "", 
  size = 24 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle 
        cx="24" 
        cy="12" 
        r="8" 
        fill="currentColor" 
        stroke="currentColor" 
        strokeWidth="1.5"
      />
      <path 
        opacity="0.5" 
        d="M40 35C40 39.9706 40 44 24 44C8 44 8 39.9706 8 35C8 30.0294 15.1634 26 24 26C32.8366 26 40 30.0294 40 35Z" 
        fill="currentColor" 
        stroke="currentColor" 
        strokeWidth="1.5"
      />
    </svg>
  );
};