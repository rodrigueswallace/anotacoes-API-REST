import React from 'react';

interface MetodoAquisicaoIconProps {
  className?: string;
  size?: number;
}

export const MetodoAquisicaoIcon: React.FC<MetodoAquisicaoIconProps> = ({ 
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
        d="M8.07064 23.1466C8.9942 18.5288 9.45598 16.2199 11.1148 14.8599C12.7737 13.5 15.1283 13.5 19.8376 13.5H28.1623C32.8716 13.5 35.2262 13.5 36.8851 14.8599C38.5439 16.2199 39.0057 18.5288 39.9293 23.1466L41.1293 29.1466C42.4574 35.7874 43.1215 39.1079 41.3212 41.3039C39.5208 43.5 36.1347 43.5 29.3623 43.5H18.6376C11.8653 43.5 8.47907 43.5 6.67873 41.3039C4.87838 39.1079 5.54247 35.7874 6.87064 29.1466L8.07064 23.1466Z" 
        fill="currentColor"
      />
      <circle 
        cx="30" 
        cy="19.5" 
        r="2" 
        fill="currentColor"
      />
      <circle 
        cx="18" 
        cy="19.5" 
        r="2" 
        fill="currentColor"
      />
      <path 
        d="M19.5 11.5C19.5 9.01472 21.5147 7 24 7C26.4853 7 28.5 9.01472 28.5 11.5V13.5H29.3623C30.116 13.5 30.8277 13.5 31.5 13.503L31.5 11.5C31.5 7.35786 28.1421 4 24 4C19.8579 4 16.5 7.35786 16.5 11.5L16.5 13.503C17.1723 13.5 17.884 13.5 18.6376 13.5H19.5V11.5Z" 
        fill="currentColor"
      />
    </svg>
  );
};