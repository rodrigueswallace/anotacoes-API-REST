import React from 'react';
import { ArrowLeft, Check, Trash2, FileText, FileCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useResponsiveCollapse } from '@/hooks/use-responsive-collapse';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export interface ActionItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  type: 'success' | 'warning' | 'danger' | 'info' | 'info-dark';
  onClick: () => void;
}

interface ActionMenuProps {
  actions: ActionItem[];
  collapsed: boolean;
  onBack?: () => void;
  onToggleCollapse?: () => void;
  className?: string;
  isFixed?: boolean;
}

const ActionIcon = () => (
  <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path opacity="0.5" d="M22.203 4.60693C22.203 4.60693 22.3111 6.44524 23.9331 8.06728C25.5552 9.68932 27.3935 9.79746 27.3935 9.79746M13.4669 20.7836L11.2168 18.5335" stroke="#1C3821" strokeWidth="1.5"/>
    <path d="M22.2028 4.60658L23.0679 3.7415C24.5012 2.30817 26.8251 2.30817 28.2584 3.7415C29.6917 5.17482 29.6917 7.4987 28.2584 8.93202L27.3933 9.79711L19.4402 17.7503C18.9015 18.289 18.6321 18.5583 18.3352 18.7899C17.9848 19.0632 17.6058 19.2974 17.2047 19.4886C16.8647 19.6506 16.5034 19.7711 15.7806 20.012L13.4667 20.7833L11.9695 21.2824C11.6139 21.4009 11.2218 21.3083 10.9567 21.0432C10.6916 20.7782 10.599 20.386 10.7176 20.0304L11.2166 18.5332L11.9879 16.2193C12.2288 15.4965 12.3493 15.1352 12.5113 14.7952C12.7025 14.3941 12.9367 14.0151 13.21 13.6647C13.4416 13.3678 13.711 13.0984 14.2497 12.5597L22.2028 4.60658Z" stroke="#1C3821" strokeWidth="1.5"/>
    <path opacity="0.5" d="M29.3334 15.9998C29.3334 23.3636 23.3639 29.3332 16.0001 29.3332C8.63629 29.3332 2.66675 23.3636 2.66675 15.9998C2.66675 8.63604 8.63629 2.6665 16.0001 2.6665" stroke="#1C3821" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const SaveIcon = () => (
  <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle opacity="0.5" cx="10.5001" cy="9.99984" r="8.33333" stroke="white" strokeWidth="1.5"/>
    <path d="M7.58325 10.4165L9.24992 12.0832L13.4166 7.9165" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const RejectIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_2112_9816)">
      <circle opacity="0.5" cx="10.0001" cy="9.99984" r="8.33333" stroke="white" strokeWidth="1.5"/>
      <path d="M12.0834 7.91652L7.91675 12.0832M7.91673 7.9165L12.0834 12.0832" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </g>
    <defs>
      <clipPath id="clip0_2112_9816">
        <rect width="20" height="20" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const DiscardIcon = () => (
  <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path opacity="0.5" d="M13.8333 3.3335C15.6459 3.34359 16.6274 3.42396 17.2678 4.06428C18 4.79651 18 5.97503 18 8.33205V13.332C18 15.6891 18 16.8676 17.2678 17.5998C16.5355 18.3321 15.357 18.332 13 18.332H8C5.64298 18.332 4.46447 18.3321 3.73223 17.5998C3 16.8676 3 15.6891 3 13.332V8.33205C3 5.97503 3 4.79651 3.73223 4.06428C4.37255 3.42396 5.35414 3.34359 7.16667 3.3335" stroke="white" strokeWidth="1.5"/>
    <path d="M7.16675 2.9165C7.16675 2.22615 7.72639 1.6665 8.41675 1.6665H12.5834C13.2738 1.6665 13.8334 2.22615 13.8334 2.9165V3.74984C13.8334 4.44019 13.2738 4.99984 12.5834 4.99984H8.41675C7.72639 4.99984 7.16675 4.44019 7.16675 3.74984V2.9165Z" stroke="white" strokeWidth="1.5"/>
    <path d="M12.5834 9.16654L8.41678 13.3332M8.41677 9.16652L12.5834 13.3332" stroke="#FAFAFA" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const CancelIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle opacity="0.5" cx="10" cy="10" r="8.33333" stroke="white" strokeWidth="1.5"/>
    <path d="M6.66675 10.0002H13.3334" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.83325 3.3335L3.33325 5.8335L5.83325 8.3335" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path opacity="0.5" d="M3.33325 5.8335H12.4999C14.8011 5.8335 16.6666 7.69898 16.6666 10.0002C16.6666 12.3013 14.8011 14.1668 12.4999 14.1668H6.66659" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const getActionButtonClasses = (type: ActionItem['type'], collapsed: boolean) => {
  const baseClasses = "w-full h-9 rounded-[8px] font-sora font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 hover:opacity-90 focus:ring-2 focus:ring-offset-2 focus:outline-none";
  
  const typeClasses = {
    success: "bg-main-success text-main-white focus:ring-main-success",
    warning: "bg-main-warning text-main-white focus:ring-main-warning", 
    danger: "bg-main-danger text-main-white focus:ring-main-danger",
    info: "bg-main-info text-main-white focus:ring-main-info",
    'info-dark': "bg-main-info-dark text-main-white focus:ring-main-info-dark"
  };

  const responsiveClasses = collapsed ? "w-[44px] h-9 p-0" : "";
  
  return cn(baseClasses, typeClasses[type], responsiveClasses);
};

export const ActionMenu: React.FC<ActionMenuProps> = ({
  actions,
  collapsed,
  onBack,
  onToggleCollapse,
  className,
  isFixed = false
}) => {
  const { shouldCollapse: shouldAutoCollapse } = useResponsiveCollapse();
  const isCollapsed = isFixed ? collapsed : (collapsed || shouldAutoCollapse);
  
  return (
    <div
      className={cn(
        "bg-main-white rounded-md border border-second-white transition-all duration-300 flex flex-col h-full",
        isCollapsed ? "w-[76px]" : "w-[240px]",
        "p-3.5",
        isFixed ? "shadow-xl backdrop-blur-sm bg-main-white/95" : "shadow-md",
        className
      )}
    >
      {/* Header */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={cn(
              "mb-0 cursor-pointer transition-colors duration-200 hover:bg-gray-50 rounded-md p-2 -m-2",
              onToggleCollapse ? "" : "cursor-default hover:bg-transparent"
            )}
            onClick={onToggleCollapse}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <ActionIcon />
              {!isCollapsed && (
                <h3 className="font-sora font-normal text-lg text-main-dark">
                  Menu de ações
                </h3>
              )}
            </div>
            {isCollapsed && (
              <div className="flex justify-center mb-4">
                <h3 className="font-sora font-normal text-sm text-main-dark leading-tight">
                  Ações
                </h3>
              </div>
            )}
            <div className="w-full h-px bg-second-white" />
          </div>
        </TooltipTrigger>
        {onToggleCollapse && (
          <TooltipContent>
            <p>{isCollapsed ? "Expandir menu" : "Colapsar menu"}</p>
          </TooltipContent>
        )}
      </Tooltip>

      {/* Action Buttons */}
      <div className={cn(
        "space-y-3 flex-1 mt-4",
        isFixed && "overflow-y-auto scrollbar-thin scrollbar-thumb-border/20 scrollbar-track-transparent"
      )}>
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={getActionButtonClasses(action.type, isCollapsed)}
            aria-label={isCollapsed ? action.label : undefined}
            title={isCollapsed ? action.label : undefined}
          >
            {action.icon}
            {!isCollapsed && <span>{action.label}</span>}
          </button>
        ))}
      </div>

      {/* Back Button */}
      {onBack && (
        <div className="mt-auto">
          <button
            onClick={onBack}
            className={cn(
              "w-full h-9 rounded-[8px] font-sora font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 bg-main-info text-main-white hover:opacity-90 focus:ring-2 focus:ring-main-info focus:ring-offset-2 focus:outline-none",
              isCollapsed ? "w-[44px] h-9 p-0" : ""
            )}
            aria-label={isCollapsed ? "Voltar" : undefined}
            title={isCollapsed ? "Voltar" : undefined}
          >
            <BackIcon />
            {!isCollapsed && <span>Voltar</span>}
          </button>
        </div>
      )}
    </div>
  );
};

// Default action configurations for common use cases
export const defaultActions: Record<string, ActionItem> = {
  save: {
    id: 'save',
    label: 'Salvar',
    icon: <SaveIcon />,
    type: 'success',
    onClick: () => console.log('Salvar clicked')
  },
  reject: {
    id: 'reject', 
    label: 'Reprovar',
    icon: <RejectIcon />,
    type: 'warning',
    onClick: () => console.log('Reprovar clicked')
  },
  discard: {
    id: 'discard',
    label: 'Descartar', 
    icon: <DiscardIcon />,
    type: 'danger',
    onClick: () => console.log('Descartar clicked')
  },
  cancel: {
    id: 'cancel',
    label: 'Cancelar',
    icon: <CancelIcon />,
    type: 'warning',
    onClick: () => console.log('Cancelar clicked')
  }
};