import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface FormSelectFieldProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
  error?: boolean;
  className?: string;
  clearable?: boolean;
  onClear?: () => void;
}

const FormSelectField = ({ value, onValueChange, placeholder, options, disabled, error, className, clearable, onClear }: FormSelectFieldProps) => {
  const hasValue = Boolean(value);
  
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onValueChange) {
      onValueChange("");
    }
  };

  return (
    <div className="relative">
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          className={cn(
            // Base styles following design system
            "flex h-8 w-full rounded-lg border px-3 py-2 font-sora text-sm transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            "focus:text-second-dark",
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
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-main-white border-second-white">
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="font-sora text-sm text-second-dark hover:bg-light-white focus:bg-light-white"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {clearable && hasValue && !disabled && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleClear();
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
  )
}
FormSelectField.displayName = "FormSelectField"

export { FormSelectField }