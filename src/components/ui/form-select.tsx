import * as React from "react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const FormSelect = Select

const FormSelectGroup = React.forwardRef<
  React.ElementRef<typeof Select>,
  React.ComponentPropsWithoutRef<typeof Select>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
))
FormSelectGroup.displayName = "FormSelectGroup"

const FormSelectValue = SelectValue

const FormSelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectTrigger>,
  React.ComponentPropsWithoutRef<typeof SelectTrigger> & {
    hasValue?: boolean;
    onClear?: () => void;
  }
>(({ className, hasValue, onClear, children, ...props }, ref) => (
  <div className="relative">
    <SelectTrigger
      ref={ref}
      className={cn(
        "flex h-8 w-full items-center justify-between rounded-lg border border-second-white bg-main-white px-3 py-2 font-sora text-sm transition-all duration-200",
        // Conditional text coloring based on value state
        hasValue ? "text-second-dark" : "text-second-black/60",
        "placeholder:text-second-black/60",
        "focus:outline-none focus:ring-2 focus:ring-second-primary/20 focus:ring-offset-2",
        "hover:border-second-primary/20",
        // Conditional disabled styles based on value state
        hasValue 
          ? "disabled:bg-light-white disabled:text-second-dark/70 disabled:border-second-white/70 disabled:cursor-not-allowed disabled:opacity-100"
          : "disabled:bg-light-white disabled:text-second-black/40 disabled:border-second-white/70 disabled:cursor-not-allowed disabled:opacity-100",
        "[&>span]:line-clamp-1",
        // Add padding for clear button when present
        hasValue && onClear && "pr-8",
        className
      )}
      {...props}
    >
      {children}
    </SelectTrigger>
    {hasValue && onClear && (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClear();
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 rounded-sm opacity-50 hover:opacity-100 focus:opacity-100 z-10"
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
))
FormSelectTrigger.displayName = SelectTrigger.displayName

const FormSelectContent = React.forwardRef<
  React.ElementRef<typeof SelectContent>,
  React.ComponentPropsWithoutRef<typeof SelectContent>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectContent
    ref={ref}
    className={cn(
      "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-second-white bg-main-white text-second-dark shadow-md",
      position === "popper" &&
        "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    )}
    position={position}
    {...props}
  >
    {children}
  </SelectContent>
))
FormSelectContent.displayName = SelectContent.displayName

const FormSelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectItem>,
  React.ComponentPropsWithoutRef<typeof SelectItem>
>(({ className, ...props }, ref) => (
  <SelectItem
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
FormSelectLabel.displayName = "FormSelectLabel"

const FormSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectItem>,
  React.ComponentPropsWithoutRef<typeof SelectItem>
>(({ className, children, ...props }, ref) => (
  <SelectItem
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-light-white focus:text-second-dark data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    {children}
  </SelectItem>
))
FormSelectItem.displayName = SelectItem.displayName

const FormSelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectItem>,
  React.ComponentPropsWithoutRef<typeof SelectItem>
>(({ className, ...props }, ref) => (
  <SelectItem
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-second-white", className)}
    {...props}
  />
))
FormSelectSeparator.displayName = "FormSelectSeparator"

export {
  FormSelect,
  FormSelectGroup,
  FormSelectValue,
  FormSelectTrigger,
  FormSelectContent,
  FormSelectLabel,
  FormSelectItem,
  FormSelectSeparator,
}