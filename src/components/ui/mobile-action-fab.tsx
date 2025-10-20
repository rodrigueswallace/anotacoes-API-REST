import * as React from "react";
import { MoreHorizontal, X } from "lucide-react";
import { GhostButtonWithIcon } from "@/components/ui/primary-buttons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ActionItem } from "@/components/ui/action-menu";

interface MobileActionFabProps {
  actions: ActionItem[];
  className?: string;
}

const getActionButtonClasses = (type: ActionItem['type']) => {
  const baseClasses = "w-full justify-start gap-3 h-12 text-sm font-medium transition-all duration-200 rounded-[8px]";
  
  switch (type) {
    case 'success':
      return cn(baseClasses, "bg-main-success hover:bg-main-success/90 text-main-white");
    case 'warning':
      return cn(baseClasses, "bg-main-warning hover:bg-main-warning/90 text-main-white");
    case 'danger':
      return cn(baseClasses, "bg-main-danger hover:bg-main-danger/90 text-main-white");
    case 'info':
      return cn(baseClasses, "bg-main-info hover:bg-main-info/90 text-main-white");
    case 'info-dark':
      return cn(baseClasses, "bg-main-info-dark hover:bg-main-info-dark/90 text-main-white");
    default:
      return cn(baseClasses, "bg-main-primary hover:bg-main-primary/90 text-main-white");
  }
};

export function MobileActionFab({ actions, className }: MobileActionFabProps) {
  const [open, setOpen] = React.useState(false);

  // Debug log to check if actions are being passed
  React.useEffect(() => {
    console.log("MobileActionFab actions:", actions);
  }, [actions]);

  const handleActionClick = (action: ActionItem) => {
    action.onClick();
    setOpen(false);
  };

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <GhostButtonWithIcon 
            icon={<MoreHorizontal className="h-4 w-4" />}
          />
        </DrawerTrigger>
        
        <DrawerContent className="p-0">
          <DrawerHeader className="p-4 border-b">
            <DrawerTitle className="flex items-center justify-between text-second-dark">
              Ações
            </DrawerTitle>
          </DrawerHeader>
          
          <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {actions.map((action) => (
              <Button
                key={action.id}
                className={getActionButtonClasses(action.type)}
                onClick={() => handleActionClick(action)}
              >
                <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                  {action.icon}
                </span>
                {action.label}
              </Button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}