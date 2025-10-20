import * as React from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Settings2 } from "lucide-react";
import { DataGalleryColumn } from "./data-gallery";

export interface ColumnSelectorProps {
  columns: DataGalleryColumn[];
  visibleColumns: string[];
  onColumnsChange: (columns: string[]) => void;
  className?: string;
}

const ColumnSelector = React.forwardRef<HTMLButtonElement, ColumnSelectorProps>(
  ({ columns, visibleColumns, onColumnsChange, className }, ref) => {
    const handleColumnToggle = (columnKey: string, checked: boolean) => {
      if (checked) {
        onColumnsChange([...visibleColumns, columnKey]);
      } else {
        onColumnsChange(visibleColumns.filter(key => key !== columnKey));
      }
    };

    return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Popover>
              <PopoverTrigger asChild>
                <button 
                  ref={ref}
                  className={cn(
                    "flex items-center justify-center w-10 h-8 rounded-lg border border-second-white bg-main-white hover:border-second-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-second-primary/20 focus-visible:border-second-primary transition-all duration-200",
                    className
                  )}
                >
                  <Settings2 className="h-4 w-4 text-second-primary" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3 bg-main-white border border-light-black/20 shadow-lg z-50" align="start">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-main-dark">Colunas visíveis</h4>
                  <div className="space-y-2">
                    {columns.map(column => (
                      <div key={column.key} className="flex items-start space-x-3">
                        <Checkbox
                          id={`column-${column.key}`}
                          checked={visibleColumns.includes(column.key)}
                          onCheckedChange={(checked) => handleColumnToggle(column.key, !!checked)}
                        />
                        <label 
                          htmlFor={`column-${column.key}`}
                          className="text-sm text-main-dark cursor-pointer flex-1 leading-none pt-0.5"
                        >
                          {column.title}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </TooltipTrigger>
          <TooltipContent>
            <p>Colunas</p>
          </TooltipContent>
        </Tooltip>
    );
  }
);

ColumnSelector.displayName = "ColumnSelector";

export { ColumnSelector };