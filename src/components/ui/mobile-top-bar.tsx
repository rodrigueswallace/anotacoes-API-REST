import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { UserProfileModal } from '@/components/ui/user-profile-modal';
import { NotificationsModal, type Notification } from '@/components/ui/notifications-modal';

interface MobileTopBarProps {
  onMenuClick: () => void;
  notificationCount?: number;
  userAvatar?: string;
  userName?: string;
}

export const MobileTopBar: React.FC<MobileTopBarProps> = ({
  onMenuClick,
  notificationCount = 4,
  userAvatar,
  userName = "Daniel G de Souza Fraga",
}) => {
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
  };

  const handleMarkAsRead = (id: number) => {
    console.log(`Marcando notificação ${id} como lida`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-14 w-full z-[9999] bg-white shadow-sm border-b border-border">
      <div className="flex items-center justify-between h-full px-4">
        {/* Hamburger Menu */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="h-11 w-11 p-0 hover:bg-muted rounded-lg"
          aria-label="Abrir menu de navegação"
        >
          <Menu className="h-6 w-6 text-foreground" />
        </Button>

        {/* Logo centralizada */}
        <button 
          onClick={() => navigate('/')}
          className="font-sora font-semibold text-xl text-[hsl(var(--main-primary))] hover:opacity-80 transition-opacity"
        >
          Heridium
        </button>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Notificações */}
          <NotificationsModal
            unreadCount={notificationCount || 0}
            notifications={mockNotifications}
            onMarkAllAsRead={handleMarkAllAsRead}
            onMarkAsRead={handleMarkAsRead}
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="relative h-11 w-11 p-0 hover:bg-muted rounded-lg"
                aria-label="Notificações"
              >
                <div className="h-8 w-8 rounded-full bg-[hsl(var(--second-white))] flex items-center justify-center">
                  <Bell className="h-5 w-5 text-foreground" />
                </div>
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
                className="h-11 w-11 p-0 hover:bg-muted rounded-lg"
                aria-label="Perfil do usuário"
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
      </div>
    </header>
  );
};