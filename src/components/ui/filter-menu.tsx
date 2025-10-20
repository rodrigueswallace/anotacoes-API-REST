import React from 'react';
import { cn } from '@/lib/utils';
import { useResponsiveCollapse } from '@/hooks/use-responsive-collapse';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { PrimaryButtonWithIconLeft, GhostButtonWithIconLeft, GhostButtonWithIcon } from '@/components/ui/primary-buttons';
import { PackageIcon } from './package-icon';

export interface FilterItem {
  id: string;
  label: string;
  count: number;
  onClick: () => void;
  active?: boolean;
}

export interface FilterTag {
  id: string;
  label: string;
  active?: boolean;
  onClick: () => void;
  color?: string;
}

export interface FilterTagGroup {
  title: string;
  tags: FilterTag[];
}

interface FilterMenuProps {
  title: string;
  icon: React.ReactNode;
  filterItems: FilterItem[];
  tagGroups?: FilterTagGroup[];
  onFilterClick: () => void;
  actionButton?: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  };
  collapsed: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

const FilterIcon = () => (
  <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path opacity="0.5" d="M13.3334 24V18.6667" stroke="#1C3821" strokeWidth="1.5" strokeLinecap="round"/>
    <path opacity="0.5" d="M13.3334 13.3333V8" stroke="#1C3821" strokeWidth="1.5" strokeLinecap="round"/>
    <path opacity="0.5" d="M24 24V20" stroke="#1C3821" strokeWidth="1.5" strokeLinecap="round"/>
    <path opacity="0.5" d="M24 14.6667V8" stroke="#1C3821" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10.6667 18.6667C11.7713 18.6667 12.6667 17.7712 12.6667 16.6667C12.6667 15.5621 11.7713 14.6667 10.6667 14.6667C9.56206 14.6667 8.66669 15.5621 8.66669 16.6667C8.66669 17.7712 9.56206 18.6667 10.6667 18.6667Z" stroke="#1C3821" strokeWidth="1.5"/>
    <path d="M21.3334 18.6667C22.4379 18.6667 23.3334 17.7712 23.3334 16.6667C23.3334 15.5621 22.4379 14.6667 21.3334 14.6667C20.2288 14.6667 19.3334 15.5621 19.3334 16.6667C19.3334 17.7712 20.2288 18.6667 21.3334 18.6667Z" stroke="#1C3821" strokeWidth="1.5"/>
  </svg>
);

const FilterButtonIcon = () => (
  <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.83325 5.8335H17.1666M6.33325 10.0002H14.6666M8.83325 14.1668H12.1666" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const TagIcon = () => (
  <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="10.3151" height="10.3151" transform="matrix(0.685509 0.728064 -0.685509 0.728064 7.07129 0.919922)" fill="currentColor"/>
  </svg>
);

const getFilterItemClasses = (active: boolean, collapsed: boolean) => {
  const baseClasses = "w-full h-9 rounded-[8px] font-sora text-sm transition-all duration-200 flex items-center hover:bg-gray-50 focus:outline-none focus:ring-0";
  
  const activeClasses = active 
    ? "bg-light-primary/30 text-main-primary border border-light-primary" 
    : "text-second-dark border border-transparent";

  const responsiveClasses = collapsed ? "w-[44px] h-9 p-0 justify-center gap-0" : "justify-between px-2 gap-2";
  
  return cn(baseClasses, activeClasses, responsiveClasses);
};

const getPriorityClasses = (label: string, active: boolean, customColor?: string) => {
  // Use custom color if provided
  if (customColor) {
    return active 
      ? `bg-${customColor}/10 text-${customColor} border border-${customColor}` 
      : `bg-transparent text-${customColor} hover:bg-${customColor}/10 border border-transparent`;
  }
  
  // Fallback to original priority system
  const priorityColors = {
    'Alta': active ? 'bg-main-danger/10 text-main-danger' : 'bg-transparent text-main-danger hover:bg-main-danger/10',
    'Média': active ? 'bg-main-warning/10 text-main-warning' : 'bg-transparent text-main-warning hover:bg-main-warning/10',
    'Baixa': active ? 'bg-main-success/10 text-main-success' : 'bg-transparent text-main-success hover:bg-main-success/10'
  };
  
  return priorityColors[label as keyof typeof priorityColors] || 'bg-gray-100 text-gray-700 hover:bg-gray-200';
};

export const FilterMenu: React.FC<FilterMenuProps> = ({
  title,
  icon,
  filterItems,
  tagGroups = [],
  onFilterClick,
  actionButton,
  collapsed,
  onToggleCollapse,
  className
}) => {
  const { shouldCollapse: shouldAutoCollapse } = useResponsiveCollapse();
  const isCollapsed = collapsed || shouldAutoCollapse;
  
  return (
    <div
      className={cn(
        "bg-main-white rounded-md shadow-md border border-second-white transition-all duration-300 flex flex-col flex-shrink-0 h-full",
        isCollapsed ? "w-[76px]" : "min-w-[240px] w-[240px]",
        "p-4",
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
              {icon}
               {!isCollapsed && (
                 <h3 className="font-sora font-normal text-base text-main-dark">
                   {title}
                 </h3>
               )}
            </div>
            {isCollapsed && (
              <div className="flex justify-center mb-4">
                <h3 className="font-sora font-normal text-sm text-main-dark leading-tight text-center">
                  Filtros
                </h3>
              </div>
            )}
            <div className="w-full h-px bg-second-white" />
          </div>
        </TooltipTrigger>
        {onToggleCollapse && (
          <TooltipContent>
            <p>{isCollapsed ? "Expandir filtros" : "Colapsar filtros"}</p>
          </TooltipContent>
        )}
      </Tooltip>

      {/* Filter Items */}
      <div className="space-y-2 mt-4">
        {filterItems.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className={getFilterItemClasses(item.active || false, isCollapsed)}
            aria-label={isCollapsed ? item.label : undefined}
            title={isCollapsed ? item.label : undefined}
          >
            {!isCollapsed ? (
              <>
                <div className="flex items-center gap-2">
                  <PackageIcon 
                    size={24} 
                    className={item.active ? "text-main-primary" : "text-second-dark"} 
                  />
                  <span className={cn(
                    "font-sora font-normal text-sm",
                    item.active ? "text-main-primary" : "text-second-dark"
                  )}>{item.label}</span>
                </div>
                <Badge variant="secondary" className="text-xs bg-second-primary text-main-white rounded-lg hover:bg-second-primary">
                  {item.count}
                </Badge>
              </>
            ) : (
              <PackageIcon 
                size={24} 
                className={item.active ? "text-main-primary" : "text-second-dark"} 
              />
            )}
          </button>
        ))}
        
        {/* Filter Button */}
        {isCollapsed ? (
          <GhostButtonWithIcon
            onClick={onFilterClick}
            icon={<FilterButtonIcon />}
            className="w-full"
          />
        ) : (
          <GhostButtonWithIconLeft
            onClick={onFilterClick}
            icon={<FilterButtonIcon />}
            className="w-full"
          >
            Filtrar
          </GhostButtonWithIconLeft>
        )}
      </div>

      {/* Linha divisória */}
      <div className="w-full h-px bg-second-white mt-4 mb-4"></div>

      {/* Tag Groups */}
      {tagGroups.length > 0 && (
        <div className="hidden h-lg:block">
          {tagGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-4 last:mb-0">
              {!isCollapsed && (
            <h4 className="font-sora font-normal text-sm text-main-dark mb-3">
              {group.title}
            </h4>
              )}
              <div className={cn(
                "flex flex-col gap-2",
                isCollapsed && "items-center"
              )}>
                {group.tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={tag.onClick}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 justify-start",
                      getPriorityClasses(tag.label, tag.active || false, tag.color),
                      isCollapsed && "w-8 h-8 p-0 text-xs justify-center"
                    )}
                    title={isCollapsed ? tag.label : undefined}
                  >
                    {!isCollapsed && (
                      <>
                        <TagIcon />
                        <span>{tag.label}</span>
                      </>
                    )}
                    {isCollapsed && (() => {
                      const abbreviations: Record<string, string> = {
                        'Nota fiscal': 'NF',
                        'Tombo direto': 'TD',
                        'Via NF-e': 'NF'
                      };
                      return abbreviations[tag.label] || tag.label.charAt(0).toUpperCase();
                    })()}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Button */}
      {actionButton && (
        <div className="mt-auto">
          {!isCollapsed ? (
            <PrimaryButtonWithIconLeft
              onClick={actionButton.onClick}
              icon={actionButton.icon}
              className="w-full h-9"
            >
              {actionButton.label}
            </PrimaryButtonWithIconLeft>
          ) : (
            <button
              onClick={actionButton.onClick}
              className={cn(
                "w-[44px] h-9 p-0 rounded-[8px] font-sora font-semibold text-sm transition-all duration-200 flex items-center justify-center bg-main-success text-main-white hover:opacity-90 focus:ring-2 focus:ring-main-success focus:ring-offset-2 focus:outline-none"
              )}
              aria-label={actionButton.label}
              title={actionButton.label}
            >
              {actionButton.icon}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Default filter configurations for common use cases
export const defaultFilterItems: FilterItem[] = [
  {
    id: 'todos',
    label: 'Todos',
    count: 254,
    onClick: () => console.log('Todos clicked'),
    active: false
  },
  {
    id: 'recebimento',
    label: 'Recebimento',
    count: 254,
    onClick: () => console.log('Recebimento clicked')
  },
  {
    id: 'tombo',
    label: 'Tombo',
    count: 8,
    onClick: () => console.log('Tombo clicked')
  },
  {
    id: 'etiquetagem',
    label: 'Etiquetagem',
    count: 54,
    onClick: () => console.log('Etiquetagem clicked')
  },
  {
    id: 'concluido',
    label: 'Concluído',
    count: 254,
    onClick: () => console.log('Concluído clicked')
  },
  {
    id: 'favoritos',
    label: 'Favoritos',
    count: 254,
    onClick: () => console.log('Favoritos clicked')
  }
];

export const defaultTagGroups: FilterTagGroup[] = [
  {
    title: 'Tipo',
    tags: [
      {
        id: 'nf',
        label: 'NF',
        active: true,
        onClick: () => console.log('NF clicked')
      },
      {
        id: 'tombo-direto',
        label: 'Tombo direto',
        onClick: () => console.log('Tombo direto clicked')
      },
      {
        id: 'via-nf-e',
        label: 'Via NF-e',
        onClick: () => console.log('Via NF-e clicked')
      }
    ]
  }
];