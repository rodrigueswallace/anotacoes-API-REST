import { useState, useEffect } from 'react';
import { useSidebarToggle } from './use-sidebar-toggle';

interface FixedActionMenuDimensions {
  top: number;
  right: number;
  height: string;
  shouldCollapse: boolean;
  isVisible: boolean;
}

export function useFixedActionMenu(): FixedActionMenuDimensions {
  const { isCollapsed: sidebarCollapsed } = useSidebarToggle();
  const [dimensions, setDimensions] = useState<FixedActionMenuDimensions>({
    top: 112, // TopBar height + additional spacing
    right: 24,
    height: 'calc(100vh - 136px)', // 112px top + 24px bottom
    shouldCollapse: false,
    isVisible: true
  });

  useEffect(() => {
    const calculateDimensions = () => {
      const viewportWidth = window.innerWidth;
      const sidebarWidth = sidebarCollapsed ? 64 : 240; // 16 * 4 = 64px, 240px
      const menuExpandedWidth = 240; // w-60 = 240px
      const menuCollapsedWidth = 64; // Collapsed width
      const margins = 48; // 24px left + 24px right
      
      // Calculate available space for content
      const availableWidth = viewportWidth - sidebarWidth - margins;
      
      // Determine if menu should collapse based on available space
      const shouldCollapse = availableWidth < (600 + menuExpandedWidth); // 600px min content + menu
      
      // Hide completely on very small screens
      const isVisible = viewportWidth >= 768;
      
      setDimensions({
        top: 112,
        right: 24,
        height: 'calc(100vh - 136px)',
        shouldCollapse,
        isVisible
      });
    };

    calculateDimensions();
    
    const handleResize = () => calculateDimensions();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarCollapsed]);

  return dimensions;
}