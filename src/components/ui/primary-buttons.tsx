import React from 'react';
import { cn } from '@/lib/utils';
import { DefaultIcon } from './icon';

interface BaseButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  withBorder?: boolean;
}

// Base button styles following design system specifications
const baseButtonStyles = "min-h-8 min-w-8 rounded-lg font-sora font-semibold text-sm leading-none text-main-white bg-second-primary transition-all duration-200 hover:bg-second-primary/80 focus:bg-second-primary/80 focus:outline-none focus:ring-2 focus:ring-second-primary/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";

// PrimaryButton - Botão principal preenchido
export const PrimaryButton: React.FC<BaseButtonProps> = ({ 
  children, 
  onClick, 
  disabled = false, 
  className = "" 
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(baseButtonStyles, "px-2.5 py-1.5", className)}
    >
      {children}
    </button>
  );
};

// PrimaryButtonWithIconRight - Botão com ícone à direita
export const PrimaryButtonWithIconRight: React.FC<BaseButtonProps> = ({ 
  children, 
  onClick, 
  disabled = false, 
  className = "",
  icon = <DefaultIcon />
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(baseButtonStyles, "px-2.5 py-1.5 gap-2", className)}
    >
      <span>{children}</span>
      <span className="flex-shrink-0">{icon}</span>
    </button>
  );
};

// PrimaryButtonWithIconLeft - Botão com ícone à esquerda
export const PrimaryButtonWithIconLeft: React.FC<BaseButtonProps> = ({ 
  children, 
  onClick, 
  disabled = false, 
  className = "",
  icon = <DefaultIcon />
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(baseButtonStyles, "px-2.5 py-1.5 gap-2", className)}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span>{children}</span>
    </button>
  );
};

// PrimaryButtonWithIcon - Botão apenas com ícone (sem texto)
export const PrimaryButtonWithIcon: React.FC<BaseButtonProps> = ({ 
  onClick, 
  disabled = false, 
  className = "",
  icon = <DefaultIcon />
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(baseButtonStyles, "px-2.5 py-1.5", className)}
    >
      {icon}
    </button>
  );
};

// PrimaryGhostButton - Botão tipo "Ghost" (sem preenchimento, com borda)
export const PrimaryGhostButton: React.FC<BaseButtonProps> = ({ 
  children, 
  onClick, 
  disabled = false, 
  className = "" 
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "min-h-8 min-w-8 rounded-lg font-sora font-semibold text-sm leading-none text-second-primary bg-main-white border border-second-primary transition-all duration-200 hover:bg-second-primary hover:text-main-white focus:bg-second-primary/10 focus:outline-none focus:ring-2 focus:ring-second-primary/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center px-2.5 py-1.5",
        className
      )}
    >
      {children}
    </button>
  );
};

// GhostButtonWithIconRight - Botão ghost com ícone à direita
export const GhostButtonWithIconRight: React.FC<BaseButtonProps> = ({ 
  children, 
  onClick, 
  disabled = false, 
  className = "",
  icon = <DefaultIcon />
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
         "min-h-8 min-w-8 rounded-lg font-sora font-semibold text-sm leading-none text-second-primary bg-main-white border border-second-primary transition-all duration-200 hover:bg-second-primary hover:text-main-white focus:bg-second-primary/10 focus:outline-none focus:ring-2 focus:ring-second-primary/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center px-2.5 py-1.5 gap-2",
        className
      )}
    >
      <span>{children}</span>
      <span className="flex-shrink-0">{icon}</span>
    </button>
  );
};

// GhostButtonWithIconLeft - Botão ghost com ícone à esquerda
export const GhostButtonWithIconLeft: React.FC<BaseButtonProps> = ({ 
  children, 
  onClick, 
  disabled = false, 
  className = "",
  icon = <DefaultIcon />
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "min-h-8 min-w-8 rounded-lg font-sora font-semibold text-sm leading-none text-second-primary bg-main-white border border-second-primary transition-all duration-200 hover:bg-second-primary hover:text-main-white focus:bg-second-primary/10 focus:outline-none focus:ring-2 focus:ring-second-primary/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center px-2.5 py-1.5 gap-2",
        className
      )}
    >
      <span className="flex-shrink-0 [&>svg]:transition-colors [&>svg]:duration-200">{icon}</span>
      <span>{children}</span>
    </button>
  );
};

// GhostButtonWithIcon - Botão ghost apenas com ícone (sem texto)
export const GhostButtonWithIcon = React.forwardRef<HTMLButtonElement, BaseButtonProps>(({ 
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
        "min-h-8 min-w-8 w-8 h-8 rounded-lg font-sora font-semibold text-sm leading-none text-second-primary transition-all duration-200 hover:bg-light-primary focus:bg-second-primary/10 focus:outline-none focus:ring-2 focus:ring-second-primary/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center",
        withBorder ? "bg-main-white border border-second-primary" : "bg-transparent",
        className
      )}
    >
      {icon}
    </button>
  );
});

GhostButtonWithIcon.displayName = "GhostButtonWithIcon";
