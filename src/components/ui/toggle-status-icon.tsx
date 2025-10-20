import React from 'react';

interface ToggleStatusIconProps {
  size?: number;
  className?: string;
  isActive?: boolean;
}

// Ícone de olho aberto (para ativar quando linha está inativa)
const EyeOpenIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path opacity="0.5" d="M2.72891 12.7464C2.02064 11.8263 1.6665 11.3662 1.6665 10C1.6665 8.63389 2.02064 8.17381 2.72891 7.25365C4.14314 5.41634 6.51493 3.33337 9.99984 3.33337C13.4847 3.33337 15.8565 5.41634 17.2708 7.25365C17.979 8.17381 18.3332 8.63389 18.3332 10C18.3332 11.3662 17.979 11.8263 17.2708 12.7464C15.8565 14.5837 13.4847 16.6667 9.99984 16.6667C6.51493 16.6667 4.14314 14.5837 2.72891 12.7464Z" stroke="#14664A" strokeWidth="1.5"/>
    <path d="M12.5 10C12.5 11.3807 11.3807 12.5 10 12.5C8.61929 12.5 7.5 11.3807 7.5 10C7.5 8.61929 8.61929 7.5 10 7.5C11.3807 7.5 12.5 8.61929 12.5 10Z" stroke="#14664A" strokeWidth="1.5"/>
  </svg>
);

// Ícone de olho riscado (para inativar quando linha está ativa)
const EyeOffIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path opacity="0.5" d="M2.72891 12.7464C2.02064 11.8263 1.6665 11.3662 1.6665 10C1.6665 8.63389 2.02064 8.17381 2.72891 7.25365C4.14314 5.41634 6.51493 3.33337 9.99984 3.33337C13.4847 3.33337 15.8565 5.41634 17.2708 7.25365C17.979 8.17381 18.3332 8.63389 18.3332 10C18.3332 11.3662 17.979 11.8263 17.2708 12.7464C15.8565 14.5837 13.4847 16.6667 9.99984 16.6667C6.51493 16.6667 4.14314 14.5837 2.72891 12.7464Z" stroke="#14664A" strokeWidth="1.5"/>
    <path d="M12.5 10C12.5 11.3807 11.3807 12.5 10 12.5C8.61929 12.5 7.5 11.3807 7.5 10C7.5 8.61929 8.61929 7.5 10 7.5C11.3807 7.5 12.5 8.61929 12.5 10Z" stroke="#14664A" strokeWidth="1.5"/>
    <path d="M17.5 3.33337L2.9611 17.0387" stroke="#14664A" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const ToggleStatusIcon: React.FC<ToggleStatusIconProps> = ({ 
  size = 20, 
  className = "",
  isActive = true
}) => {
  const Icon = isActive ? EyeOffIcon : EyeOpenIcon;
  
  return (
    <div className={className}>
      <Icon size={size} />
    </div>
  );
};