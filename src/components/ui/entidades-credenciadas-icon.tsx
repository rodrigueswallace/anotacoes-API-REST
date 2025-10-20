import React from 'react';

interface EntidadesCredenciadasIconProps {
  className?: string;
  size?: number;
}

export const EntidadesCredenciadasIcon: React.FC<EntidadesCredenciadasIconProps> = ({ 
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
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M6.75503 10.1648C6 11.2406 6 14.4381 6 20.8333V23.9827C6 35.2589 14.4779 40.731 19.7971 43.0545C21.24 43.6848 21.9615 44 24 44V4C22.3772 4 20.81 4.53648 17.6754 5.60943L16.5298 6.00158C10.5166 8.05991 7.51006 9.08908 6.75503 10.1648Z" 
        fill="currentColor"
      />
      <path 
        opacity="0.5" 
        d="M42 23.9827V20.8333C42 14.4381 42 11.2406 41.245 10.1648C40.4899 9.08908 37.4834 8.05991 31.4702 6.00159L30.3246 5.60943C27.19 4.53648 25.6228 4 24 4V44C26.0385 44 26.76 43.6849 28.2029 43.0546C33.5221 40.731 42 35.2589 42 23.9827Z" 
        fill="currentColor"
      />
    </svg>
  );
};