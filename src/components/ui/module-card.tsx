
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface ModuleCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  className?: string;
  onClick?: (href: string) => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  id,
  title,
  description,
  icon,
  href,
  className,
  onClick
}) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    if (onClick) {
      onClick(href);
    } else {
      navigate(href);
    }
  };

  return (
    <div
      key={id}
      onClick={handleCardClick}
      className={cn(
        "group cursor-pointer bg-card rounded-[10px] p-6 relative flex flex-col",
        "border border-transparent transition-all duration-200",
        "hover:border-second-primary hover:-translate-y-1",
        "focus:outline-none focus:ring-2 focus:ring-main-primary focus:ring-offset-2",
        "w-full max-w-[400px] min-h-[220px] h-auto",
        className
      )}
      style={{
        boxShadow: '0 -1px 4px rgba(0, 0, 0, 0.01), 0 4px 10px rgba(0, 0, 0, 0.08)'
      }}
      tabIndex={0}
      role="button"
      aria-label={`Acessar ${title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Icon - positioned inside the card */}
      <div className="flex items-center justify-center w-12 h-12 mb-6 text-second-primary">
        {icon}
      </div>

      {/* Title */}
      <h3 
        className="font-semibold text-main-dark mb-4"
        style={{ fontFamily: 'var(--font-sora)', fontSize: '18px' }}
      >
        {title}
      </h3>

      {/* Description */}
      <p 
        className="text-sm text-second-black mb-6 leading-normal"
        style={{ fontFamily: 'var(--font-sora)' }}
      >
        {description}
      </p>

      {/* Action Link */}
      <div className="flex items-center gap-2 text-second-primary group-hover:gap-3 transition-all duration-200 mt-auto">
        <span className="text-sm font-medium">Acessar página</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:translate-x-1">
          <path d="M3.33398 8H12.6673" stroke="#14664A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 3.33398L12.6667 8.00065L8 12.6673" stroke="#14664A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
};
