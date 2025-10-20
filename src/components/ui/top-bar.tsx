import React from 'react';
import { Menu, ChevronLeft, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';
import { useNavigate } from 'react-router-dom';
import { UserProfileModal } from '@/components/ui/user-profile-modal';
import { NotificationsModal, type Notification } from '@/components/ui/notifications-modal';

interface TopBarProps {
  notificationCount?: number;
  userAvatar?: string;
  userName?: string;
  onProfileClick?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  notificationCount = 4,
  userAvatar,
  userName = "Daniel G de Souza Fraga",
  onProfileClick = () => alert('Perfil clicado'),
}) => {
  const { isCollapsed, toggle } = useSidebarToggle();
  const navigate = useNavigate();
  
  // Mock notifications data
  const mockNotifications: Notification[] = [
    {
      id: 1,
      title: "Nova mensagem em Mapeamento de dados",
      description: "Inventário 185",
      timeAgo: "54min atrás",
      type: "message",
      isRead: false
    },
    {
      id: 2,
      title: "Nova mensagem em Mapeamento de dados",
      description: "Inventário 185",
      timeAgo: "3h atrás",
      type: "message",
      isRead: false
    },
    {
      id: 3,
      title: "Nova conversa em Solicitação de titulares",
      description: "Solicitação 2564; Tarefa 8",
      timeAgo: "4 dias atrás",
      type: "conversation",
      isRead: false
    },
    {
      id: 4,
      title: "Atualização de sistema",
      description: "Nova versão disponível v2.1.4",
      timeAgo: "1 semana atrás",
      type: "message",
      isRead: false
    }
  ];

  const handleMarkAllAsRead = () => {
    console.log('Marcando todas as notificações como lidas');
    // Aqui você implementaria a lógica para marcar como lidas
  };

  const handleMarkAsRead = (id: number) => {
    console.log(`Marcando notificação ${id} como lida`);
    // Aqui você implementaria a lógica para marcar uma notificação específica como lida
  };

  const leftSvg = `data:image/svg+xml;base64,${btoa(`
    <svg width="20" height="49" viewBox="0 0 20 49" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0H20L13 49H0V0Z" fill="#176E51"/>
    </svg>
  `)}`;

  const rightSvg = `data:image/svg+xml;base64,${btoa(`
    <svg width="400" height="48" viewBox="0 0 400 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_2166_9424)">
        <rect width="400" height="48" fill="white"/>
        <path d="M18 -1H400V48H2.5L18 -1Z" fill="#74D1B1"/>
        <path d="M122.5 -1H400V48H130.5L122.5 -1Z" fill="#44B58E"/>
        <path d="M160.574 -1H400V48H119L160.574 -1Z" fill="#2F9E78"/>
        <path d="M219.5 -1H400V48H236L219.5 -1Z" fill="#248A67"/>
        <path d="M243 -1H400V48H236L243 -1Z" fill="#14664A"/>
        <path d="M294 -1H400V48H266L294 -1Z" fill="#1A835F"/>
        <path d="M325 -1H400V48H332L325 -1Z" fill="#176E51"/>
        <path d="M57 48.5L140.5 -1.5" stroke="#2F9E78" stroke-width="1.5"/>
        <path d="M99 49L89 -2" stroke="#2F9E78" stroke-width="1.5"/>
      </g>
      <defs>
        <clipPath id="clip0_2166_9424">
          <rect width="400" height="48" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  `)}`;

  return (
    <header 
      className="fixed top-0 left-0 right-0 h-12 w-full z-[9999] px-4 flex items-center justify-between overflow-hidden relative bg-white shadow-sm"
      style={{
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        transform: 'translate3d(0, 0, 0)',
        willChange: 'auto',
      }}
    >
      {/* SVG da esquerda */}
      <div 
        className="absolute left-0 top-0 h-full w-5"
        style={{
          backgroundImage: `url("${leftSvg}")`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      />
      
      {/* SVG da direita */}
      <div 
        className="absolute right-0 top-0 h-full w-[400px]"
        style={{
          backgroundImage: `url("${rightSvg}")`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      />
      {/* Seção esquerda: Botão Sidebar + Logo */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Botão de toggle da sidebar */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggle}
          className="p-1 h-8 w-8 hover:bg-gray-100/50 hover-scale transition-all duration-200 rounded-full"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 20 20" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={!isCollapsed ? "" : "transform scale-x-[-1]"}
          >
            <path d="M11 18.3338L4 10.1672L11 2.00049" stroke="#194A33" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path opacity="0.5" d="M15.6666 18.3333L8.66662 10.1667L15.6666 2" stroke="#194A33" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Button>

        {/* Logo */}
        <div className="min-w-[120px] flex items-center">
          <button 
            onClick={() => navigate('/')}
            className="font-sora font-semibold text-lg text-[hsl(var(--main-primary))] hidden sm:block hover:opacity-80 transition-opacity cursor-pointer"
          >
            Heridium
          </button>
        </div>
      </div>

      {/* Espaço flexível no meio */}
      <div className="flex-1" />

      {/* Seção direita: Notificações + Perfil */}
      <div className="flex items-center gap-4">
        {/* Botão de notificações */}
        <NotificationsModal
          unreadCount={notificationCount || 0}
          notifications={mockNotifications}
          onMarkAllAsRead={handleMarkAllAsRead}
          onMarkAsRead={handleMarkAsRead}
          trigger={
            <Button
              variant="outline"
              size="sm"
              className="relative p-1 h-8 w-8 bg-white/90 border-gray-200 hover:bg-gray-100/80 shadow-sm rounded-full"
            >
              <Bell 
                size={24} 
                className="text-gray-700 drop-shadow-sm" 
              />
              {notificationCount && notificationCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {notificationCount > 99 ? '99+' : notificationCount.toString().padStart(2, '0')}
                </Badge>
              )}
            </Button>
          }
        />

        {/* Avatar do usuário */}
        <UserProfileModal
          user={{
            name: userName,
            email: "fraga_souza@hotmail.com",
            avatarUrl: userAvatar
          }}
          onEditInfo={() => console.log('Editar informações')}
          onChangePassword={() => console.log('Alterar senha')}
          onLogout={() => console.log('Desconectar')}
          trigger={
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-8 w-8 hover:bg-transparent rounded-full"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback className="bg-[hsl(var(--main-primary))] text-white text-sm">
                  <User size={16} />
                </AvatarFallback>
              </Avatar>
            </Button>
          }
        />
      </div>
    </header>
  );
};
