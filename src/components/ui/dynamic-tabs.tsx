import * as React from "react"
import { LucideIcon } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useScrollShadows } from "@/hooks/use-scroll-shadows"

export interface TabItem {
  id: string
  label: string
  icon: LucideIcon
  content?: React.ReactNode
}

interface DynamicTabsProps {
  items: TabItem[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  maxVisibleTabs?: number
  dependencies?: any[]
  maxContentHeight?: string
}

export function DynamicTabs({
  items,
  defaultValue,
  value,
  onValueChange,
  className,
  maxVisibleTabs = 4,
  dependencies = [],
  maxContentHeight = "calc(100vh - 400px)"
}: DynamicTabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultValue || items[0]?.id || "")
  const [containerWidth, setContainerWidth] = React.useState(0)
  const [windowWidth, setWindowWidth] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const { scrollRef, showTopShadow, showBottomShadow } = useScrollShadows()

  const currentTab = value || activeTab

  React.useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
      setWindowWidth(window.innerWidth)
    }

    updateWidth()
    
    // Usar ResizeObserver para detectar mudanças na largura do container
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width)
      }
    })
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }
    
    // Window resize para detectar mudanças na largura da tela
    window.addEventListener('resize', updateWidth)
    
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateWidth)
    }
  }, [...dependencies])

  const handleTabChange = (newValue: string) => {
    console.log('DynamicTabs: tab change', newValue)
    setActiveTab(newValue)
    onValueChange?.(newValue)
  }

  // Calcular quantas abas cabem no espaço disponível baseado na largura do componente
  const tabWidth = 150 // largura estimada por aba (ajustada para ícones e fonte maiores)
  const dropdownWidth = 80 // largura estimada do botão "Mais"
  const containerPadding = 32 // padding do container (16px cada lado)
  const availableWidth = containerWidth - containerPadding - dropdownWidth
  const actualVisibleCount = containerWidth > 0 ? Math.floor(availableWidth / tabWidth) : items.length
  
  // Em mobile (< 768px), mostrar apenas dropdown
  const isMobile = windowWidth > 0 && windowWidth < 768
  const finalVisibleCount = isMobile ? 0 : Math.min(actualVisibleCount, 8)
  
  const shouldUseOverflow = isMobile || (containerWidth > 0 && items.length > finalVisibleCount)
  
  const visibleItems = shouldUseOverflow ? items.slice(0, finalVisibleCount) : items
  const overflowItems = shouldUseOverflow ? (isMobile ? items : items.slice(finalVisibleCount)) : []

  return (
    <div ref={containerRef} className={cn("w-full h-full", className)}>
      <div className="bg-main-white rounded-md shadow-md border border-second-white overflow-hidden h-full flex flex-col">
        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full h-full flex flex-col">
          <div className="p-4 flex-shrink-0">
            <TabsList className="h-auto p-0 bg-transparent border-b border-border w-full justify-start">
              {/* Abas visíveis */}
              {visibleItems.map((item) => (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className={cn(
                    "font-sora text-base font-normal px-4 py-3 bg-transparent border-0 rounded-none",
                    "data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                    "data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:text-primary",
                    "data-[state=inactive]:text-dark hover:text-primary transition-colors",
                    "flex items-center gap-2 min-w-fit"
                  )}
                >
                  <item.icon className="w-6 h-6 shrink-0" />
                  <span className="whitespace-nowrap">{item.label}</span>
                </TabsTrigger>
              ))}

              {/* Dropdown para abas em overflow */}
              {shouldUseOverflow && overflowItems.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "font-sora text-base font-normal px-4 py-3 h-auto",
                        "text-dark hover:text-primary transition-colors",
                        "flex items-center gap-2",
                        overflowItems.some(item => item.id === currentTab) && "text-primary border-b-2 border-b-primary"
                      )}
                    >
                      {(() => {
                        const activeOverflowItem = overflowItems.find(item => item.id === currentTab)
                        return activeOverflowItem ? (
                          <>
                            <activeOverflowItem.icon className="w-6 h-6" />
                            <span>{activeOverflowItem.label}</span>
                          </>
                        ) : (
                          <span>Mais</span>
                        )
                      })()}
                      <ChevronDown className="w-6 h-6" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-white border border-border shadow-lg z-50 min-w-[200px]">
                    {overflowItems.map((item) => (
                      <DropdownMenuItem
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        className={cn(
                          "flex items-center gap-2 cursor-pointer font-sora text-base",
                          currentTab === item.id && "bg-muted text-primary"
                        )}
                      >
                        <item.icon className="w-6 h-6" />
                        <span>{item.label}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </TabsList>
          </div>

          {/* Conteúdo das abas */}
          <div className="flex-1 relative">
            {/* Scroll shadows */}
            {showTopShadow && (
              <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-background/80 to-transparent z-10 pointer-events-none" />
            )}
            {showBottomShadow && (
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-background/80 to-transparent z-10 pointer-events-none" />
            )}
            
            <ScrollArea 
              className="h-full"
              viewportRef={scrollRef}
              style={{ maxHeight: maxContentHeight }}
            >
              <div className="p-4 pt-0">
                {items.map((item) => (
                  <TabsContent
                    key={item.id}
                    value={item.id}
                    className="m-0 data-[state=inactive]:hidden"
                  >
                    {item.content}
                  </TabsContent>
                ))}
              </div>
            </ScrollArea>
          </div>
        </Tabs>
      </div>
    </div>
  )
}