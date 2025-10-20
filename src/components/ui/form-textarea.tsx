import * as React from "react"
import { cn } from "@/lib/utils"

export interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  isSelected?: boolean;
  error?: boolean;
}

const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ className, isSelected, error, disabled, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          // Base styles following design system
          "flex min-h-[80px] w-full rounded-lg border px-3 py-2 font-sora text-sm transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "focus:text-second-dark",
          "resize-none",
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
FormTextarea.displayName = "FormTextarea"

export { FormTextarea }