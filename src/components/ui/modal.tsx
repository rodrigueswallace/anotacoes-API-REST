
import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

const modalVariants = cva("", {
  variants: {
    size: {
      sm: "max-w-[494px]",
      md: "max-w-[542px]",
      lg: "max-w-[972px]",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

export interface ModalProps extends VariantProps<typeof modalVariants> {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  actions?: React.ReactNode
  className?: string
  maxHeight?: string
  "aria-describedby"?: string
  // Optional: prevent closing on escape key and outside interactions
  preventCloseOnEscape?: boolean
  preventCloseOnInteractOutside?: boolean
}

const Modal = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  ModalProps
>(({ open, onOpenChange, title, description, children, actions, className, maxHeight, size, "aria-describedby": ariaDescribedBy, preventCloseOnEscape, preventCloseOnInteractOutside }, ref) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
        ref={ref}
        className={cn(
          // Reset default styles and apply custom design system with proper centering
          "p-0 gap-0 rounded-md border-0 bg-transparent shadow-lg flex flex-col",
          // Remove default close button
          "[&>button]:hidden",
          // Proper responsive positioning - centered with adequate spacing from header/footer
          "fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]",
          // Responsive sizing with proper constraints
          "w-full",
          // Ensure modal doesn't exceed viewport height with proper spacing
          "max-h-[85vh] overflow-y-hidden overflow-x-hidden",
          modalVariants({ size }),
          className
        )}
        style={{ 
          maxHeight: maxHeight || '80vh',
        }}
        aria-describedby={ariaDescribedBy}
        onEscapeKeyDown={preventCloseOnEscape ? (e) => e.preventDefault() : undefined}
        onInteractOutside={(e) => {
          // Sempre previne fechamento se a prop está ativa
          if (preventCloseOnInteractOutside) {
            e.preventDefault();
            return;
          }
          
          // Previne fechamento se o clique foi em input file ou elementos relacionados ao upload
          const target = e.target as Element;
          const isFileInput = target.closest('input[type="file"]') !== null;
          const isFileUploadArea = target.closest('[data-file-upload]') !== null;
          
          if (isFileInput || isFileUploadArea) {
            e.preventDefault();
          }
        }}
      >
        {/* Header with Light/Black background - fixed */}
        <DialogHeader className="bg-light-black rounded-t-md pl-[18px] pr-4 py-[14px] flex flex-row items-center justify-between space-y-0 flex-shrink-0">
          <DialogTitle className="font-sora text-base font-normal text-main-dark text-left">
            {title}
          </DialogTitle>
          
          <DialogDescription className="sr-only">
            {description || title}
          </DialogDescription>
          
          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="inline-flex items-center justify-center w-6 h-6 rounded-sm text-second-black hover:text-second-black/80 focus:outline-none focus:ring-2 focus:ring-second-primary/20 transition-colors"
            aria-label="Fechar modal"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        {/* Content with Main/White background - scrollable */}
        <div className="bg-main-white rounded-b-md flex flex-col min-h-0 flex-1">
          {/* Form content area - scrollable */}
          <div 
            className="p-4 space-y-4 overflow-y-auto flex-1 min-h-0 overflow-x-hidden"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'hsl(var(--second-primary)) transparent'
            }}
          >
            {children}
          </div>

          {/* Actions area - fixed at bottom */}
          {actions && (
            <div className="px-4 pt-6 pb-4 flex justify-end gap-2 flex-shrink-0 border-t border-light-white">
              {actions}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
})
Modal.displayName = "Modal"

export { Modal }
