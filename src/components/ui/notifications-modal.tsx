import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { MessageCircle, Users, X, Check } from "lucide-react"
import { useScrollShadows } from "@/hooks/use-scroll-shadows"
import { PrimaryButtonWithIconRight } from "@/components/ui/primary-buttons"

export interface Notification {
  id: number
  title: string
  description: string
  timeAgo: string
  type: "message" | "conversation"
  isRead?: boolean
}

export interface NotificationsModalProps {
  unreadCount: number
  notifications: Notification[]
  onMarkAllAsRead?: () => void
  onMarkAsRead?: (id: number) => void
  trigger?: React.ReactNode
}

const NotificationsModal = ({ 
  unreadCount, 
  notifications = [], 
  onMarkAllAsRead, 
  onMarkAsRead,
  trigger 
}: NotificationsModalProps) => {
  const [activeTab, setActiveTab] = React.useState<"unread" | "read">("unread")
  
  const unreadNotifications = notifications.filter(n => !n.isRead)
  const readNotifications = notifications.filter(n => n.isRead)
  
  const displayNotifications = activeTab === "unread" ? unreadNotifications : readNotifications

  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent 
        className="w-[370px] h-[456px] p-0 bg-main-white border shadow-lg rounded-lg"
        align="end"
        sideOffset={8}
      >
        <NotificationsModalHeader />
        <NotificationsModalTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          unreadCount={unreadCount}
        />
        <NotificationsModalList notifications={displayNotifications} onMarkAsRead={onMarkAsRead} />
        {activeTab === "unread" && (
          <NotificationsModalMarkAllReadButton 
            onClick={onMarkAllAsRead}
            disabled={unreadNotifications.length === 0}
          />
        )}
      </PopoverContent>
    </Popover>
  )
}

const NotificationsModalHeader = () => (
  <div className="h-12 bg-light-black px-4 flex items-center rounded-t-lg">
    <h2 className="text-main-dark font-semibold text-base">
      Notificações
    </h2>
  </div>
)

interface NotificationsModalTabsProps {
  activeTab: "unread" | "read"
  onTabChange: (tab: "unread" | "read") => void
  unreadCount: number
}

const NotificationsModalTabs = ({ activeTab, onTabChange, unreadCount }: NotificationsModalTabsProps) => (
  <div className="h-10 px-4 border-b border-light-black">
    <div className="flex h-full">
      <button
        onClick={() => onTabChange("unread")}
        className={cn(
          "px-2 py-2 text-sm font-medium border-b-2 mr-4 transition-colors",
          activeTab === "unread"
            ? "text-main-primary border-main-primary"
            : "text-main-dark border-transparent hover:text-main-primary"
        )}
      >
        Não lidas - {unreadCount}
      </button>
      <button
        onClick={() => onTabChange("read")}
        className={cn(
          "px-2 py-2 text-sm font-medium border-b-2 transition-colors",
          activeTab === "read"
            ? "text-main-primary border-main-primary"
            : "text-main-dark border-transparent hover:text-main-primary"
        )}
      >
        Lidas
      </button>
    </div>
  </div>
)

interface NotificationsModalListProps {
  notifications: Notification[]
  onMarkAsRead?: (id: number) => void
}

const NotificationsModalList = ({ notifications, onMarkAsRead }: NotificationsModalListProps) => {
  const { scrollRef, showTopShadow, showBottomShadow } = useScrollShadows()
  
  return (
    <div className="relative flex-1">
      {/* Top shadow */}
      <div 
        className={cn(
          "absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-black/10 to-transparent z-10 pointer-events-none transition-opacity duration-200",
          showTopShadow ? "opacity-100" : "opacity-0"
        )}
      />
      
      {/* Scroll area */}
      <div 
        ref={scrollRef}
        className="px-4 max-h-[302px] overflow-y-auto"
      >
        <div className="py-2">
          {notifications.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-second-dark text-sm">
              Nenhuma notificação encontrada
            </div>
          ) : (
            notifications.map((notification, index) => (
              <NotificationsModalNotificationItem
                key={notification.id}
                notification={notification}
                isLast={index === notifications.length - 1}
                onMarkAsRead={onMarkAsRead}
              />
            ))
          )}
        </div>
      </div>
      
      {/* Bottom shadow */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-black/10 to-transparent z-10 pointer-events-none transition-opacity duration-200",
          showBottomShadow ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  )
}

interface NotificationsModalNotificationItemProps {
  notification: Notification
  isLast?: boolean
  onMarkAsRead?: (id: number) => void
}

const NotificationsModalNotificationItem = ({ 
  notification, 
  isLast = false,
  onMarkAsRead
}: NotificationsModalNotificationItemProps) => {
  const Icon = notification.type === "message" ? MessageCircle : Users
  
  return (
    <div className={cn(
      "relative flex items-start gap-3 py-2",
      !isLast && "border-b border-light-black"
    )}>
      <div className="w-9 h-9 rounded-full bg-light-black flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-main-primary" />
      </div>
      <div className="flex-1 min-w-0 pr-6">
        <p className="text-second-dark text-sm font-normal leading-tight mb-1">
          {notification.title}
        </p>
        <p className="text-second-dark text-sm font-semibold leading-tight mb-2">
          {notification.description}
        </p>
        <p className="text-second-dark text-xs">
          {notification.timeAgo}
        </p>
      </div>
      {!notification.isRead && onMarkAsRead && (
        <button
          onClick={() => onMarkAsRead(notification.id)}
          className="absolute top-2 right-0 w-5 h-5 rounded-full bg-light-black hover:bg-second-dark flex items-center justify-center transition-colors group"
          aria-label="Marcar como lida"
        >
          <X className="w-3 h-3 text-second-dark group-hover:text-main-white" />
        </button>
      )}
    </div>
  )
}

interface NotificationsModalMarkAllReadButtonProps {
  onClick?: () => void
  disabled?: boolean
}

const NotificationsModalMarkAllReadButton = ({ 
  onClick, 
  disabled = false 
}: NotificationsModalMarkAllReadButtonProps) => (
  <div className="p-4">
    <PrimaryButtonWithIconRight
      onClick={onClick}
      disabled={disabled}
      className="w-full h-8"
      icon={<Check className="w-4 h-4" />}
    >
      Marcar todos como lidas
    </PrimaryButtonWithIconRight>
  </div>
)

// Export components
export { 
  NotificationsModal,
  NotificationsModalHeader,
  NotificationsModalTabs,
  NotificationsModalNotificationItem,
  NotificationsModalMarkAllReadButton
}