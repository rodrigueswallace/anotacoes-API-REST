
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useResponsiveCollapse } from '@/hooks/use-responsive-collapse';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ModuleCard {
  id: string;
  title: string;
  icon: React.ReactNode;
  href: string;
}

interface TabData {
  id: string;
  label: string;
  icon: React.ReactNode;
  cards: ModuleCard[];
}

interface TabbedModuleCardsProps {
  tabs: TabData[];
  defaultActiveTab?: string;
  className?: string;
}

export const TabbedModuleCards: React.FC<TabbedModuleCardsProps> = ({
  tabs,
  defaultActiveTab,
  className
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.id);
  const navigate = useNavigate();
  const { shouldCollapse } = useResponsiveCollapse();
  
  // Update active tab when defaultActiveTab prop changes
  React.useEffect(() => {
    if (defaultActiveTab) {
      setActiveTab(defaultActiveTab);
    }
  }, [defaultActiveTab]);
  
  const activeTabData = tabs.find(tab => tab.id === activeTab);

  const handleCardClick = (href: string) => {
    navigate(href);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Mobile/Small Screen Dropdown */}
      {shouldCollapse ? (
        <div className="mb-[68px]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center justify-between w-full px-4 py-3 rounded-lg border border-border bg-card",
                  "text-base font-medium text-main-dark transition-colors duration-200",
                  "hover:bg-accent focus:outline-none focus:ring-2 focus:ring-main-primary focus:ring-offset-2"
                )}
                style={{ fontFamily: 'var(--font-sora)' }}
              >
                <div className="flex items-center gap-3">
                  {activeTabData?.icon}
                  <span>{activeTabData?.label}</span>
                </div>
                <ChevronDown size={20} className="text-main-dark" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-full min-w-[280px]">
              {tabs.map((tab) => (
                <DropdownMenuItem
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 cursor-pointer",
                    "transition-colors duration-200",
                    activeTab === tab.id 
                      ? "bg-accent text-second-primary" 
                      : "text-main-dark hover:bg-accent"
                  )}
                  style={{ fontFamily: 'var(--font-sora)' }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        /* Desktop Tabs Navigation */
        <div 
          role="tablist" 
          className="flex border-b border-border mb-[68px]"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-4 whitespace-nowrap relative",
                "text-base transition-colors duration-200 font-normal",
                "focus:outline-none",
                "hover:text-second-primary",
                activeTab === tab.id 
                  ? "text-second-primary" 
                  : "text-main-dark"
              )}
              style={{ fontFamily: 'var(--font-sora)' }}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {/* Active indicator */}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-second-primary" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Tab Content */}
      <div
        id={`tabpanel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className={shouldCollapse ? "" : ""}
      >
        {activeTabData && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-7 gap-y-16">
            {activeTabData.cards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.href)}
                 className={cn(
                   "group cursor-pointer bg-card rounded-[10px] relative",
                   "border border-transparent transition-all duration-200",
                   "hover:border-second-primary hover:-translate-y-1",
                   "focus:outline-none focus:ring-2 focus:ring-main-primary focus:ring-offset-2",
                   "min-w-full md:min-w-[280px]",
                   "pt-6 px-6 pb-6"
                 )}
                 style={{
                   boxShadow: '0 -1px 4px rgba(0, 0, 0, 0.01), 0 4px 10px rgba(0, 0, 0, 0.08)',
                   minHeight: '247px'
                 }}
                tabIndex={0}
                role="button"
                aria-label={`Acessar ${card.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(card.href);
                  }
                }}
              >
                {/* Icon - positioned to overlap the top of the card */}
                <div className="absolute -top-8 left-6 flex items-center justify-center w-16 h-16 bg-second-primary rounded-lg">
                  {card.icon}
                </div>

                {/* Title */}
                <h3 
                  className="font-semibold text-main-dark mt-6 mb-4"
                  style={{ fontFamily: 'var(--font-sora)', fontSize: '18px' }}
                >
                  {card.title}
                </h3>

                {/* Action Link */}
                <div className="flex items-center gap-2 text-second-primary group-hover:gap-3 transition-all duration-200 mt-8">
                  <span className="text-sm font-medium">Acessar módulo</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:translate-x-1">
                    <path d="M3.33398 8H12.6673" stroke="#14664A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 3.33398L12.6667 8.00065L8 12.6673" stroke="#14664A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
