import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { Check, ChevronDown, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

export interface FormSearchableSelectOption {
  value: string;
  label: string;
}

interface FormSearchableSelectContextType {
  value: string
  onValueChange: (value: string) => void
  open: boolean
  onOpenChange: (open: boolean) => void
  searchValue: string
  onSearchChange: (search: string) => void
  visibleItemsCount: number
  setVisibleItemsCount: React.Dispatch<React.SetStateAction<number>>
  options: FormSearchableSelectOption[]
}

const FormSearchableSelectContext = React.createContext<FormSearchableSelectContextType | null>(null)

const useFormSearchableSelect = () => {
  const context = React.useContext(FormSearchableSelectContext)
  if (!context) {
    throw new Error("FormSearchableSelect components must be used within FormSearchableSelect")
  }
  return context
}

interface FormSearchableSelectProps {
  children?: React.ReactNode
  value?: string
  onValueChange?: (value: string) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  options: FormSearchableSelectOption[]
  placeholder?: string
  disabled?: boolean
  error?: boolean
  className?: string
  clearable?: boolean
  onClear?: () => void
  side?: "top" | "right" | "bottom" | "left"
}

const FormSearchableSelect = ({ children, value = "", onValueChange, open: controlledOpen, onOpenChange, options, placeholder, disabled, error, className, clearable, onClear, side = "bottom" }: FormSearchableSelectProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState<string>(value)
  const [searchValue, setSearchValue] = React.useState("")
  const [visibleItemsCount, setVisibleItemsCount] = React.useState(0)

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value)
    }
  }, [value])

  React.useEffect(() => {
    if (!open) {
      setSearchValue("")
    }
  }, [open])

  const handleValueChange = React.useCallback((newValue: string) => {
    setSelectedValue(newValue)
    onValueChange?.(newValue)
    setOpen(false)
  }, [onValueChange, setOpen])

  const handleSearchChange = React.useCallback((search: string) => {
    setSearchValue(search)
  }, [])

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onValueChange) {
      onValueChange("");
    }
  };

  const hasValue = Boolean(selectedValue);
  const displayLabel = options.find(opt => opt.value === selectedValue)?.label || selectedValue;

  return (
    <FormSearchableSelectContext.Provider value={{
      value: selectedValue,
      onValueChange: handleValueChange,
      open,
      onOpenChange: setOpen,
      searchValue,
      onSearchChange: handleSearchChange,
      visibleItemsCount,
      setVisibleItemsCount,
      options
    }}>
      <div className="relative">
        <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
          <PopoverPrimitive.Trigger asChild>
            <button
              disabled={disabled}
              className={cn(
                // Base styles following design system
                "flex h-8 w-full rounded-lg border px-3 py-2 font-sora text-sm transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                "focus:text-second-dark items-center justify-between",
                // Conditional text coloring based on value state
                hasValue ? "text-second-dark" : "text-second-black/60",
                // Natural state (default)
                !error && !disabled && [
                  "bg-main-white border-second-white",
                  "hover:border-second-primary/20",
                  "focus-visible:border-second-primary focus-visible:ring-second-primary/20"
                ],
                // Disabled state
                disabled && [
                  "bg-light-white border-second-white/70",
                  "cursor-not-allowed opacity-50"
                ],
                // Error state
                error && !disabled && [
                  "bg-main-white border-main-danger",
                  "focus-visible:border-main-danger focus-visible:ring-main-danger/20"
                ],
                // Add padding for clear button when present
                clearable && hasValue && !disabled && "pr-8",
                className
              )}
            >
              <span className="truncate">
                {displayLabel || placeholder || "Selecione uma opção..."}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
            </button>
          </PopoverPrimitive.Trigger>
          
          <PopoverPrimitive.Content
            align="start"
            side={side}
            className={cn(
              "relative z-[100] max-h-[200px] w-full overflow-hidden rounded-lg border bg-main-white border-second-white shadow-md",
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
            )}
            style={{ width: 'var(--radix-popover-trigger-width)' }}
          >
            <div className="flex items-center border-b border-second-white px-3 py-2">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Input
                placeholder="Pesquisar..."
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="h-6 border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <div className="max-h-[140px] overflow-y-auto overflow-x-hidden p-1">
              {options.map((option) => {
                const searchText = searchValue.toLowerCase()
                const itemText = option.label.toLowerCase()
                const isVisible = !searchValue || itemText.includes(searchText)
                const isSelected = selectedValue === option.value

                if (!isVisible) return null

                return (
                  <div
                    key={option.value}
                    className={cn(
                      "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
                      "font-sora text-second-dark",
                      "hover:bg-light-white focus:bg-light-white",
                      isSelected && "bg-light-white"
                    )}
                    onClick={() => handleValueChange(option.value)}
                  >
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      {isSelected && <Check className="h-4 w-4" />}
                    </span>
                    <span>{option.label}</span>
                  </div>
                )
              })}
              {searchValue && options.filter(option => 
                option.label.toLowerCase().includes(searchValue.toLowerCase())
              ).length === 0 && (
                <div className="py-6 text-center text-sm text-second-black/60">
                  Nenhum resultado encontrado
                </div>
              )}
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Root>
        
        {clearable && hasValue && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleClear();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 rounded-sm opacity-50 hover:opacity-100 focus:opacity-100 z-[60]"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </FormSearchableSelectContext.Provider>
  )
}

// Legacy components - maintained for backward compatibility but deprecated
// Use FormSearchableSelect with options prop instead

const FormSearchableSelectTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  console.warn('FormSearchableSelectTrigger is deprecated. Use FormSearchableSelect with options prop instead.')
  return <div ref={ref} className={className} {...props} />
})
FormSearchableSelectTrigger.displayName = "FormSearchableSelectTrigger"

const FormSearchableSelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  console.warn('FormSearchableSelectContent is deprecated. Use FormSearchableSelect with options prop instead.')
  return <div ref={ref} className={className} {...props} />
})
FormSearchableSelectContent.displayName = "FormSearchableSelectContent"

const FormSearchableSelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  console.warn('FormSearchableSelectItem is deprecated. Use FormSearchableSelect with options prop instead.')
  return <div ref={ref} className={className} {...props} />
})
FormSearchableSelectItem.displayName = "FormSearchableSelectItem"

const FormSearchableSelectEmpty = ({ children }: { children: React.ReactNode }) => {
  console.warn('FormSearchableSelectEmpty is deprecated. Use FormSearchableSelect with options prop instead.')
  return <div>{children}</div>
}

export {
  FormSearchableSelect,
  FormSearchableSelectTrigger,
  FormSearchableSelectContent,
  FormSearchableSelectItem,
  FormSearchableSelectEmpty,
}