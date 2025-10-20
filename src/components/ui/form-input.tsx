import * as React from "react"
import { cn } from "@/lib/utils"

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isSelected?: boolean;
  error?: boolean;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, type, isSelected, error, disabled, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles following design system
          "flex h-8 w-full rounded-lg border px-3 py-2 font-sora text-sm transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "focus:text-second-dark",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          // Natural state (default)
          !isSelected && !error && !disabled && [
            "bg-main-white text-second-dark border-second-white",
            "placeholder:text-second-black/60",
            "hover:border-second-primary/20",
            "focus-visible:border-second-primary focus-visible:ring-second-primary/20"
          ],
          // Selected state
          isSelected && !error && !disabled && [
            "bg-main-white text-second-dark border-second-primary",
            "placeholder:text-second-dark/60",
            "focus-visible:border-second-primary focus-visible:ring-second-primary/20"
          ],
          // Disabled state
          disabled && [
            "bg-light-white text-second-dark/70 border-second-white/70",
            "placeholder:text-second-black/40",
            "cursor-not-allowed"
          ],
          // Error state
          error && !disabled && [
            "bg-main-white text-second-black border-main-danger",
            "placeholder:text-second-black/60",
            "focus-visible:border-main-danger focus-visible:ring-main-danger/20"
          ],
          className
        )}
        ref={ref}
        disabled={disabled}
        {...props}
      />
    )
  }
)
FormInput.displayName = "FormInput"

export { FormInput }