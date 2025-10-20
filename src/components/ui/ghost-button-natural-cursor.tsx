import React from 'react';
import { cn } from '@/lib/utils';
import { DefaultIcon } from './icon';

interface GhostButtonNaturalCursorProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  withBorder?: boolean;
}

/**
 * Botão ghost apenas com ícone que mantém o cursor natural quando desabilitado.
 * Diferente do GhostButtonWithIcon padrão, este componente não exibe cursor-not-allowed
 * quando está desabilitado, mantendo o cursor padrão do sistema.
 */
export const GhostButtonNaturalCursor = React.forwardRef<HTMLButtonElement, GhostButtonNaturalCursorProps>(({ 
  onClick, 
  disabled = false, 
  className = "",
  icon = <DefaultIcon />,
  withBorder = true
}, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "min-h-8 min-w-8 w-8 h-8 rounded-lg font-sora font-semibold text-sm leading-none text-second-primary transition-all duration-200 hover:bg-light-primary focus:bg-second-primary/10 focus:outline-none focus:ring-2 focus:ring-second-primary/50 disabled:opacity-50 flex items-center justify-center",
        withBorder ? "bg-main-white border border-second-primary" : "bg-transparent",
        // Remove cursor-not-allowed quando desabilitado, mantém cursor padrão
        disabled ? "cursor-default" : "cursor-pointer",
        className
      )}
    >
      {icon}
    </button>
  );
});

GhostButtonNaturalCursor.displayName = "GhostButtonNaturalCursor";
