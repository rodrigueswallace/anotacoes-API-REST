import * as React from "react"

// Breakpoints para responsividade
const MOBILE_BREAKPOINT = 768
const MENU_COLLAPSE_BREAKPOINT = 1000

export function useResponsiveCollapse() {
  const [shouldCollapse, setShouldCollapse] = React.useState<boolean>(false)
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const [isTablet, setIsTablet] = React.useState<boolean>(false)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MENU_COLLAPSE_BREAKPOINT - 1}px)`)
    const mqlMobile = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const mqlTablet = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${MENU_COLLAPSE_BREAKPOINT - 1}px)`)
    
    const onChange = () => {
      const width = window.innerWidth
      setShouldCollapse(width < MENU_COLLAPSE_BREAKPOINT)
      setIsMobile(width < MOBILE_BREAKPOINT)
      setIsTablet(width >= MOBILE_BREAKPOINT && width < MENU_COLLAPSE_BREAKPOINT)
    }
    
    mql.addEventListener("change", onChange)
    mqlMobile.addEventListener("change", onChange)
    mqlTablet.addEventListener("change", onChange)
    
    // Set initial values
    onChange()
    
    return () => {
      mql.removeEventListener("change", onChange)
      mqlMobile.removeEventListener("change", onChange)
      mqlTablet.removeEventListener("change", onChange)
    }
  }, [])

  return { shouldCollapse, isMobile, isTablet }
}