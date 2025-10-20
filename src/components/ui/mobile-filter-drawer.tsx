import * as React from "react"
import { Filter, X } from "lucide-react"
import { GhostButtonWithIcon, GhostButtonWithIconLeft } from "@/components/ui/primary-buttons"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PackageIcon } from "@/components/ui/package-icon"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

const FilterButtonIcon = () => (
  <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.83325 5.8335H17.1666M6.33325 10.0002H14.6666M8.83325 14.1668H12.1666" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const getFilterItemClasses = (active: boolean) => {
  const baseClasses = "w-full h-9 rounded-[8px] font-sora text-sm transition-all duration-200 flex items-center justify-between px-2 gap-2 hover:bg-gray-50 focus:outline-none focus:ring-0";
  
  const activeClasses = active 
    ? "bg-light-primary/30 text-main-primary border border-light-primary" 
    : "text-second-dark border border-transparent";
    
  return `${baseClasses} ${activeClasses}`;
}

interface FilterItem {
  id: string
  label: string
  count: number
  active?: boolean
  onClick?: () => void
}

interface FilterTag {
  id: string
  label: string
  active?: boolean
  onClick?: () => void
  color?: string
}

interface FilterTagGroup {
  id: string
  title: string
  tags: FilterTag[]
}

interface MobileFilterDrawerProps {
  title: string
  filterItems: FilterItem[]
  tagGroups?: FilterTagGroup[]
  activeFiltersCount?: number
  onClearAllFilters?: () => void
  onFilterClick?: () => void
}

export function MobileFilterDrawer({
  title,
  filterItems,
  tagGroups = [],
  activeFiltersCount = 0,
  onClearAllFilters,
  onFilterClick,
}: MobileFilterDrawerProps) {
  const [open, setOpen] = React.useState(false)

  const handleClearAll = () => {
    onClearAllFilters?.()
    setOpen(false)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div className="relative">
          <GhostButtonWithIcon 
            icon={<Filter className="h-4 w-4" />}
          />
          <span className="sr-only">Filtros</span>
          {activeFiltersCount > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </div>
      </DrawerTrigger>
      <DrawerContent className="p-0">
        <DrawerHeader className="p-4 border-b">
          <DrawerTitle className="flex items-center justify-between text-second-dark">
            {title}
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="h-auto p-1 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Limpar
              </Button>
            )}
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="p-4 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Filter Items */}
          <div className="space-y-2">
            {filterItems.map((item) => (
              <button
                key={item.id}
                onClick={item.onClick}
                className={getFilterItemClasses(item.active || false)}
              >
                <div className="flex items-center gap-2">
                  <PackageIcon 
                    size={24} 
                    className={item.active ? "text-main-primary" : "text-second-dark"} 
                  />
                  <span className={`font-sora font-normal text-sm ${
                    item.active ? "text-main-primary" : "text-second-dark"
                  }`}>{item.label}</span>
                </div>
                <Badge variant="secondary" className="text-xs bg-second-primary text-main-white rounded-lg hover:bg-second-primary">
                  {item.count}
                </Badge>
              </button>
            ))}
          </div>

          {/* Tag Groups */}
          {tagGroups.map((group) => (
            <div key={group.id} className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                {group.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={tag.onClick}
                    className={`px-3 py-2 rounded-full text-sm border transition-colors ${
                      tag.active
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border hover:bg-muted'
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Filter Button */}
        {onFilterClick && (
          <div className="p-4 border-t">
            <GhostButtonWithIconLeft
              onClick={onFilterClick}
              icon={<FilterButtonIcon />}
              className="w-full"
            >
              Filtrar
            </GhostButtonWithIconLeft>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  )
}