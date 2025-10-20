
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TopBar } from '@/components/ui/top-bar';
import { MobileTopBar } from '@/components/ui/mobile-top-bar';
import { CustomSidebar } from '@/components/CustomSidebar';
import { MobileNavigationDrawer } from '@/components/ui/mobile-navigation-drawer';
import { SidebarProvider, useSidebarToggle } from '@/hooks/use-sidebar-toggle';
import { useResponsiveCollapse } from '@/hooks/use-responsive-collapse';

interface LayoutProps {
  children: React.ReactNode;
}

function LayoutContent({ children }: LayoutProps) {
  const { isCollapsed } = useSidebarToggle();
  const { isMobile } = useResponsiveCollapse();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const location = useLocation();
  
  // Não renderizar layout para páginas de autenticação
  if (location.pathname === '/login' || location.pathname === '/primeiro-acesso' || location.pathname === '/esqueceu-senha') {
    return <>{children}</>;
  }
  
  if (isMobile) {
    return (
      <div className="min-h-screen w-full">
        <MobileTopBar 
          onMenuClick={() => setIsMobileDrawerOpen(true)}
        />
        <MobileNavigationDrawer 
          open={isMobileDrawerOpen}
          onOpenChange={setIsMobileDrawerOpen}
        />
        
        <main className="pt-14 px-3 sm:px-4 md:px-6 bg-background min-h-[calc(100vh-3.5rem)] overflow-auto flex flex-col">
          {children}
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen w-full">
      <TopBar />
      <CustomSidebar />
      
      <main 
        className={`
          pt-12 px-4 lg:px-6 xl:px-8 bg-background transition-all duration-300 ease-in-out
          min-h-[calc(100vh)] overflow-auto flex flex-col
          ${isCollapsed ? 'ml-16' : 'ml-[240px]'}
        `}
      >
        {children}
      </main>
    </div>
  );
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}
