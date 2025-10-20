import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { Check, ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface FormMultiSelectContextType {
  selectedValues: string[]
  onValueChange: (values: string[]) => void
  open: boolean
  onOpenChange: (open: boolean) => void
  valueToLabelMap: Record<string, string>
  registerValueLabel: (value: string, label: string) => void
}

const FormMultiSelectContext = React.createContext<FormMultiSelectContextType | null>(null)

const useFormMultiSelect = () => {
  const context = React.useContext(FormMultiSelectContext)
  if (!context) {
    throw new Error("FormMultiSelect components must be used within FormMultiSelect")
  }
  return context
}

interface FormMultiSelectProps {
  children: React.ReactNode
  value?: string[]
  onValueChange?: (values: string[]) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const FormMultiSelect = ({ children, value = [], onValueChange, open: controlledOpen, onOpenChange }: FormMultiSelectProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const [selectedValues, setSelectedValues] = React.useState<string[]>(value)
  const [valueToLabelMap, setValueToLabelMap] = React.useState<Record<string, string>>({})

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValues(value)
    }
  }, [value])

  const handleValueChange = React.useCallback((newValues: string[]) => {
    setSelectedValues(newValues)
    onValueChange?.(newValues)
  }, [onValueChange])

  const registerValueLabel = React.useCallback((value: string, label: string) => {
    setValueToLabelMap(prev => ({ ...prev, [value]: label }))
  }, [])

  return (
    <FormMultiSelectContext.Provider value={{
      selectedValues,
      onValueChange: handleValueChange,
      open,
      onOpenChange: setOpen,
      valueToLabelMap,
      registerValueLabel
    }}>
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        {children}
      </PopoverPrimitive.Root>
    </FormMultiSelectContext.Provider>
  )
}

const FormMultiSelectGroup = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
)

const FormMultiSelectValue = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
))

interface FormMultiSelectTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  placeholder?: string;
}

const FormMultiSelectTrigger = React.forwardRef<
  HTMLButtonElement,
  FormMultiSelectTriggerProps
>(({ className, placeholder, ...props }, ref) => {
  const { selectedValues, onValueChange, valueToLabelMap } = useFormMultiSelect()

  const handleRemove = (valueToRemove: string) => {
    const newValues = selectedValues.filter(v => v !== valueToRemove)
    onValueChange(newValues)
  }

  return (
    <PopoverPrimitive.Trigger asChild>
      <button
        ref={ref}
        className={cn(
          "flex h-8 w-full items-center justify-between rounded-lg border pl-3 py-2",
          "font-sora text-sm bg-main-white border-second-white",
          selectedValues.length > 0 ? "text-second-dark" : "text-second-black/60",
          "placeholder:text-second-black/60",
          "hover:border-second-primary/20",
          "focus:outline-none focus:ring-2 focus:ring-second-primary/20 focus:border-second-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-[state=open]:border-second-primary",
          "[&>span]:line-clamp-1",
          "pr-3",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-1 mr-2 overflow-hidden">
          {selectedValues.length > 0 ? (
            selectedValues.length <= 2 ? (
              selectedValues.map((value) => (
                <Badge 
                  key={value} 
                  variant="secondary" 
                  className="text-xs font-medium bg-light-primary text-second-primary hover:bg-light-primary/80 shrink-0"
                >
                  {valueToLabelMap[value] || value}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemove(value);
                    }}
                    className="ml-1 hover:text-second-primary/80"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            ) : (
              <>
                <Badge 
                  variant="secondary" 
                  className="text-xs font-medium bg-light-primary text-second-primary hover:bg-light-primary/80 shrink-0"
                >
                  {valueToLabelMap[selectedValues[0]] || selectedValues[0]}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemove(selectedValues[0]);
                    }}
                    className="ml-1 hover:text-second-primary/80"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
                <span className="text-xs text-second-black/60 shrink-0">
                  +{selectedValues.length - 1} mais
                </span>
              </>
            )
          ) : (
            <span className="text-second-black/60 truncate">{placeholder || "Selecione opções..."}</span>
          )}
        </div>
        <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
      </button>
    </PopoverPrimitive.Trigger>
  )
})
FormMultiSelectTrigger.displayName = "FormMultiSelectTrigger"

const FormMultiSelectContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <PopoverPrimitive.Content
    ref={ref}
    align="start"
    className={cn(
      "relative z-50 max-h-96 w-full overflow-hidden rounded-lg border bg-main-white shadow-md",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    style={{ width: 'var(--radix-popover-trigger-width)' }}
    {...props}
  >
    <div className="p-1">
      {children}
    </div>
  </PopoverPrimitive.Content>
))
FormMultiSelectContent.displayName = PopoverPrimitive.Content.displayName

const FormMultiSelectLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
FormMultiSelectLabel.displayName = "FormMultiSelectLabel"

interface FormMultiSelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const FormMultiSelectItem = React.forwardRef<
  HTMLDivElement,
  FormMultiSelectItemProps
>(({ className, children, value, ...props }, ref) => {
  const { selectedValues, onValueChange, registerValueLabel } = useFormMultiSelect()
  const isSelected = selectedValues.includes(value)

  // Register the value-label mapping
  React.useEffect(() => {
    if (typeof children === 'string') {
      registerValueLabel(value, children)
    }
  }, [value, children, registerValueLabel])

  const handleClick = () => {
    const newValues = isSelected 
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value]
    onValueChange(newValues)
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
        "font-sora text-second-dark",
        "hover:bg-light-black hover:text-second-dark",
        "focus:bg-light-primary focus:text-second-primary",
        isSelected && "bg-light-primary text-second-primary",
        "cursor-pointer",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <Check className="h-4 w-4" />}
      </span>
      <span>{children}</span>
    </div>
  )
})
FormMultiSelectItem.displayName = "FormMultiSelectItem"

const FormMultiSelectSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-second-white", className)}
    {...props}
  />
))
FormMultiSelectSeparator.displayName = "FormMultiSelectSeparator"

export {
  FormMultiSelect,
  FormMultiSelectGroup,
  FormMultiSelectValue,
  FormMultiSelectTrigger,
  FormMultiSelectContent,
  FormMultiSelectLabel,
  FormMultiSelectItem,
  FormMultiSelectSeparator,
}