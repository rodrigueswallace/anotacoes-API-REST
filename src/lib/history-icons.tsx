import React from 'react';
import { 
  FileText, 
  Paperclip, 
  AlertTriangle,
  Settings,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Ícone customizado de adicionar (mesmo do botão)
const AddIconHistory = ({ className = "", size = 20 }: { className?: string; size?: number }) => (
  <svg 
    width={size * 1.05} 
    height={size} 
    viewBox="0 0 21 20" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={cn("flex-shrink-0", className)}
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

// Ícone de olho aberto (para ativar)
const EyeOpenIconHistory = ({ className = "", size = 20 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 20 20" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={cn("flex-shrink-0", className)}
  >
    <path 
      opacity="0.5" 
      d="M2.72891 12.7464C2.02064 11.8263 1.6665 11.3662 1.6665 10C1.6665 8.63389 2.02064 8.17381 2.72891 7.25365C4.14314 5.41634 6.51493 3.33337 9.99984 3.33337C13.4847 3.33337 15.8565 5.41634 17.2708 7.25365C17.979 8.17381 18.3332 8.63389 18.3332 10C18.3332 11.3662 17.979 11.8263 17.2708 12.7464C15.8565 14.5837 13.4847 16.6667 9.99984 16.6667C6.51493 16.6667 4.14314 14.5837 2.72891 12.7464Z" 
      stroke="currentColor" 
      strokeWidth="1.5"
    />
    <path 
      d="M12.5 10C12.5 11.3807 11.3807 12.5 10 12.5C8.61929 12.5 7.5 11.3807 7.5 10C7.5 8.61929 8.61929 7.5 10 7.5C11.3807 7.5 12.5 8.61929 12.5 10Z" 
      stroke="currentColor" 
      strokeWidth="1.5"
    />
  </svg>
);

// Ícone de olho riscado (para inativar)
const EyeOffIconHistory = ({ className = "", size = 20 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 20 20" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={cn("flex-shrink-0", className)}
  >
    <path 
      opacity="0.5" 
      d="M2.72891 12.7464C2.02064 11.8263 1.6665 11.3662 1.6665 10C1.6665 8.63389 2.02064 8.17381 2.72891 7.25365C4.14314 5.41634 6.51493 3.33337 9.99984 3.33337C13.4847 3.33337 15.8565 5.41634 17.2708 7.25365C17.979 8.17381 18.3332 8.63389 18.3332 10C18.3332 11.3662 17.979 11.8263 17.2708 12.7464C15.8565 14.5837 13.4847 16.6667 9.99984 16.6667C6.51493 16.6667 4.14314 14.5837 2.72891 12.7464Z" 
      stroke="currentColor" 
      strokeWidth="1.5"
    />
    <path 
      d="M12.5 10C12.5 11.3807 11.3807 12.5 10 12.5C8.61929 12.5 7.5 11.3807 7.5 10C7.5 8.61929 8.61929 7.5 10 7.5C11.3807 7.5 12.5 8.61929 12.5 10Z" 
      stroke="currentColor" 
      strokeWidth="1.5"
    />
    <path 
      d="M17.5 3.33337L2.9611 17.0387" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round"
    />
  </svg>
);

// Ícone customizado de editar (mesmo do botão de ação)
const EditIconHistory = ({ className = "", size = 20 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 20 20" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={cn("flex-shrink-0", className)}
  >
    <g clipPath="url(#clip0_edit_history)">
      <path 
        opacity="0.5" 
        d="M18.3332 8.74996V9.99996C18.3332 13.9283 18.3332 15.8925 17.1128 17.1129C15.8924 18.3333 13.9282 18.3333 9.99984 18.3333C6.07147 18.3333 4.10728 18.3333 2.88689 17.1129C1.6665 15.8925 1.6665 13.9283 1.6665 9.99996C1.6665 6.07159 1.6665 4.1074 2.88689 2.88701C4.10728 1.66663 6.07147 1.66663 9.99984 1.66663H11.2498" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
      <path 
        d="M14.4172 2.3385L13.8765 2.87918L8.90582 7.8499C8.56914 8.18658 8.4008 8.35492 8.25603 8.54053C8.08525 8.75948 7.93883 8.99639 7.81937 9.24706C7.7181 9.45955 7.64281 9.6854 7.49225 10.1371L7.01019 11.5833L6.69827 12.5191C6.62417 12.7413 6.68202 12.9864 6.84771 13.1521C7.01339 13.3178 7.25846 13.3756 7.48074 13.3015L8.4165 12.9896L9.86269 12.5075C10.3144 12.357 10.5402 12.2817 10.7527 12.1804C11.0034 12.061 11.2403 11.9145 11.4593 11.7438C11.6449 11.599 11.8132 11.4307 12.1499 11.094L17.1206 6.12325L17.6613 5.58257C18.5571 4.68675 18.5571 3.23432 17.6613 2.3385C16.7655 1.44267 15.3131 1.44267 14.4172 2.3385Z" 
        stroke="currentColor" 
        strokeWidth="1.5"
      />
      <path 
        opacity="0.5" 
        d="M13.8771 2.87927C13.8771 2.87927 13.9447 4.02822 14.9585 5.04199C15.9722 6.05577 17.1212 6.12335 17.1212 6.12335M8.41706 12.9897L7.01074 11.5834" 
        stroke="currentColor" 
        strokeWidth="1.5"
      />
    </g>
    <defs>
      <clipPath id="clip0_edit_history">
        <rect width="20" height="20" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

export type HistoryIconType = 'anexo' | 'avaliacao' | 'edicao' | 'risco' | 'comentario' | 'configuracao';

/**
 * Mapeia um tipo de ícone para seu componente React correspondente
 * Usado para padronizar ícones em históricos de ações
 */
export const getHistoryIcon = (type: HistoryIconType): React.ReactNode => {
  const iconProps = { className: "w-5 h-5 text-second-black" };
  
  switch (type) {
    case 'anexo':
      return <Paperclip {...iconProps} />;
    case 'avaliacao':
      return <EyeOpenIconHistory className="text-second-black" size={20} />;
    case 'edicao':
      return <EditIconHistory className="text-second-black" size={20} />;
    case 'risco':
      return <AlertTriangle {...iconProps} />;
    case 'comentario':
      return <FileText {...iconProps} />;
    case 'configuracao':
      return <Settings {...iconProps} />;
    default:
      return <Settings {...iconProps} />;
  }
};

/**
 * Mapeia um action_type para seu componente de ícone correspondente
 * Usado para históricos de ações de configuração
 */
export const getHistoryIconByActionType = (actionType: string): React.ReactNode => {
  const iconProps = { className: "w-5 h-5 text-second-black" };
  
  switch (actionType) {
    case 'create':
      return <AddIconHistory className="text-second-black" size={20} />;
    case 'edit':
      return <EditIconHistory className="text-second-black" size={20} />;
    case 'activate':
      return <EyeOpenIconHistory className="text-second-black" size={20} />;
    case 'deactivate':
      return <EyeOffIconHistory className="text-second-black" size={20} />;
    case 'delete':
      return <Trash2 {...iconProps} />;
    default:
      return <Settings {...iconProps} />;
  }
};
