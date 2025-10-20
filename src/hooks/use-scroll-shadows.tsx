import { useEffect, useState, useRef } from 'react';

export function useScrollShadows() {
  const [showTopShadow, setShowTopShadow] = useState(false);
  const [showBottomShadow, setShowBottomShadow] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) {
      console.log('Scroll element not found');
      return;
    }

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      
      console.log('Scroll data:', { scrollTop, scrollHeight, clientHeight });
      
      // Show top shadow if scrolled down (with small tolerance)
      const hasTopScroll = scrollTop > 5;
      setShowTopShadow(hasTopScroll);
      
      // Show bottom shadow if not at bottom (with small tolerance)
      const hasBottomScroll = scrollTop < scrollHeight - clientHeight - 5;
      setShowBottomShadow(hasBottomScroll);
      
      console.log('Shadow states:', { 
        hasTopScroll, 
        hasBottomScroll, 
        canScroll: scrollHeight > clientHeight 
      });
    };

    // Initial check with delay to ensure DOM is ready
    setTimeout(handleScroll, 100);

    scrollElement.addEventListener('scroll', handleScroll, { passive: true });
    
    // Check again when content changes
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(handleScroll, 50);
    });
    resizeObserver.observe(scrollElement);

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
    };
  }, []);

  return {
    scrollRef,
    showTopShadow,
    showBottomShadow,
  };
}