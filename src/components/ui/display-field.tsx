import * as React from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
export interface DisplayFieldProps {
  label: string;
  value: string;
  className?: string;
  required?: boolean;
}
const DisplayField = React.forwardRef<HTMLDivElement, DisplayFieldProps>(({
  label,
  value,
  className,
  required,
  ...props
}, ref) => {
  const [isOverflowing, setIsOverflowing] = React.useState(false);
  const textRef = React.useRef<HTMLSpanElement>(null);
  React.useLayoutEffect(() => {
    const element = textRef.current;
    if (element) {
      setIsOverflowing(element.scrollWidth > element.clientWidth);
    }
  }, [value]);
  const displayValue = value || "—";
  const content = <div ref={ref} className={cn("space-y-1", className)} {...props}>
        <div className="flex items-center gap-1">
          <label className="font-sora text-sm font-normal text-main-black leading-none truncate">
            {label}
          </label>
          {required && (
            <span className="text-main-danger flex-shrink-0">*</span>
          )}
        </div>
        <div className="flex items-center h-8 w-full rounded-lg border border-second-white bg-light-white px-3 py-2 font-sora text-sm text-second-dark/70">
          <span ref={textRef} className="truncate">{displayValue}</span>
        </div>
      </div>;
  if (isOverflowing && value) {
    return <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs break-words">{value}</p>
        </TooltipContent>
      </Tooltip>;
  }
  return content;
});
DisplayField.displayName = "DisplayField";
export { DisplayField };