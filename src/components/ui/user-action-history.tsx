import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Paperclip, 
  CheckCircle, 
  Edit3, 
  AlertTriangle,
  User,
  Calendar,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface UserAction {
  id: string;
  user: {
    name: string;
    avatar?: string;
    initials?: string;
  };
  timestamp: string; // formato: "13/06/2024 - 08:15h"
  action: {
    icon: React.ReactNode;
    title: string;
    description: string;
    files?: string[];
  };
}


interface UserActionHistoryProps {
  actions: UserAction[];
  className?: string;
}

export const UserActionHistory: React.FC<UserActionHistoryProps> = ({
  actions,
  className
}) => {
  return (
    <div className={cn("border border-second-white rounded-md p-6", className)}>
      <div className="space-y-6">
        {actions.map((action, index) => {
        const isLast = index === actions.length - 1;
        
        return (
          <div key={action.id} className="relative flex gap-4">
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-6 top-12 w-0.5 h-full bg-second-white" />
            )}
            
            {/* Avatar container */}
            <div className="relative flex-shrink-0 ml-1">
              <Avatar className="w-12 h-12 border-2 border-background shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                <AvatarImage src={action.user.avatar} alt={action.user.name} />
                <AvatarFallback className="bg-muted font-sora text-sm font-medium">
                  {action.user.initials || action.user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0 pb-6">
              {/* Header */}
              <div className="mb-2">
                <h4 className="font-sora text-lg font-semibold text-second-primary mb-1">
                  {action.user.name}
                </h4>
                <p className="font-sora text-sm text-second-dark">
                  {action.timestamp}
                </p>
              </div>
              
              {/* Action */}
              <div className="flex items-start gap-3 mt-4">
              <div className="flex-shrink-0">
                {action.action.icon}
              </div>
                <div className="flex-1 space-y-2">
                  {/* Descrição principal da ação */}
                  {action.action.description && (
                    <p className="font-sora text-base text-second-dark leading-relaxed whitespace-pre-line">
                      {action.action.description}
                    </p>
                  )}
                  
                  {/* Files list */}
                  {action.action.files && action.action.files.length > 0 && (
                    <div className="space-y-1 mt-2">
                      {action.action.files.map((file, fileIndex) => (
                        <p key={fileIndex} className="font-sora text-sm text-muted-foreground">
                          {file}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
};

export default UserActionHistory;