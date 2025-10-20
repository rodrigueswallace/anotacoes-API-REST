import * as React from "react";
import { cn } from "@/lib/utils";

interface SortIconProps {
  sortState: 'none' | 'asc' | 'desc';
  className?: string;
}

export const SortIcon: React.FC<SortIconProps> = ({ sortState, className }) => {
  return (
    <svg 
      width="9" 
      height="12" 
      viewBox="0 0 9 12" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-4 w-2.5", className)}
    >
      <path 
        d="M4.49943 0L8.39606 4.5H0.60281L4.49943 0Z" 
        fill="currentColor"
        className={cn(
          sortState === 'none' && "text-light-dark",
          sortState === 'asc' && "text-main-success",
          sortState === 'desc' && "text-light-dark opacity-30"
        )}
      />
      <path 
        d="M4.49943 12L8.39606 7.5H0.60281L4.49943 12Z" 
        fill="currentColor"
        className={cn(
          sortState === 'none' && "text-light-dark opacity-30",
          sortState === 'asc' && "text-light-dark opacity-30",
          sortState === 'desc' && "text-main-success"
        )}
      />
    </svg>
  );
};