import React from 'react';

interface CondicaoBemIconProps {
  className?: string;
  size?: number;
}

export const CondicaoBemIcon: React.FC<CondicaoBemIconProps> = ({ 
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
      <path 
        opacity="0.5" 
        d="M42 31.9965V19.9965C42 14.3397 42 11.5112 40.2426 9.75388C38.7059 8.21712 36.3501 8.02421 32 8H16C11.6499 8.02421 9.29413 8.21712 7.75736 9.75388C6 11.5112 6 14.3397 6 19.9965V31.9965C6 37.6534 6 40.4818 7.75736 42.2392C9.51472 43.9965 12.3431 43.9965 18 43.9965H30C35.6569 43.9965 38.4853 43.9965 40.2426 42.2392C42 40.4818 42 37.6534 42 31.9965Z" 
        fill="currentColor"
      />
      <path 
        d="M16 7C16 5.34315 17.3431 4 19 4H29C30.6569 4 32 5.34315 32 7V9C32 10.6569 30.6569 12 29 12H19C17.3431 12 16 10.6569 16 9V7Z" 
        fill="currentColor"
      />
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M31.0966 20.9765C31.6618 21.5822 31.6291 22.5313 31.0235 23.0966L22.4521 31.0966C21.8757 31.6345 20.9814 31.6345 20.4051 31.0966L16.9765 27.8966C16.3709 27.3313 16.3382 26.3822 16.9034 25.7765C17.4687 25.1709 18.4179 25.1382 19.0235 25.7034L21.4286 27.9482L28.9765 20.9034C29.5822 20.3382 30.5313 20.3709 31.0966 20.9765Z" 
        fill="currentColor"
      />
    </svg>
  );
};