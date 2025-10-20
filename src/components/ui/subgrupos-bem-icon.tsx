import React from 'react';

interface SubgruposBemIconProps {
  className?: string;
  size?: number;
}

export const SubgruposBemIcon: React.FC<SubgruposBemIconProps> = ({ 
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
        d="M16.8446 41.2361C20.3558 43.0787 22.1115 44 24 44V24L5.27603 14.1453C5.24847 14.1896 5.22139 14.2343 5.19479 14.2795C4 16.3085 4 18.8333 4 23.883V24.117C4 29.1666 4 31.6915 5.19479 33.7205C6.38959 35.7495 8.54125 36.8787 12.8446 39.137L16.8446 41.2361Z" 
        fill="currentColor"
      />
      <path 
        opacity="0.7" 
        d="M35.1548 8.86304L31.1548 6.76393C27.6435 4.92131 25.8879 4 23.9994 4C22.1108 4 20.3552 4.92131 16.8439 6.76393L12.8439 8.86304C8.63642 11.071 6.48582 12.1996 5.27539 14.1453L23.9994 24L42.7233 14.1453C41.5129 12.1996 39.3623 11.071 35.1548 8.86304Z" 
        fill="currentColor"
      />
      <path 
        opacity="0.5" 
        d="M42.8052 14.2797C42.7786 14.2345 42.7515 14.1898 42.724 14.1455L24 24.0002V44.0002C25.8885 44.0002 27.6442 43.0789 31.1554 41.2363L35.1554 39.1372C39.4587 36.8789 41.6104 35.7498 42.8052 33.7207C44 31.6917 44 29.1669 44 24.1172V23.8833C44 18.8336 44 16.3087 42.8052 14.2797Z" 
        fill="currentColor"
      />
    </svg>
  );
};