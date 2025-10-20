import React from 'react';
import { LogOut, Edit, KeyRound } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from '@/lib/utils';

interface UserProfileModalProps {
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  onEditInfo?: () => void;
  onChangePassword?: () => void;
  onLogout?: () => void;
  trigger?: React.ReactNode;
}

interface UserProfileModalSubComponents {
  Header: typeof UserProfileModalHeader;
  UserInfo: typeof UserProfileModalUserInfo;
  Action: typeof UserProfileModalAction;
  LogoutButton: typeof UserProfileModalLogoutButton;
}

const UserProfileModalHeader = ({ children }: { children: React.ReactNode }) => (
  <div 
    className="h-12 flex items-center px-4 text-main-dark bg-light-black"
    style={{
      fontFamily: 'var(--font-sora)',
      fontSize: '16px',
      fontWeight: '600'
    }}
  >
    {children}
  </div>
);

const UserProfileModalUserInfo = ({ 
  user 
}: { 
  user: { name: string; email: string; avatarUrl?: string } 
}) => (
  <div className="h-[78px] px-4 flex items-center gap-3">
    <Avatar className="w-[46px] h-[46px]">
      <AvatarImage src={user.avatarUrl} alt={user.name} />
      <AvatarFallback className="bg-muted text-main-dark">
        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
      </AvatarFallback>
    </Avatar>
    
    <div className="flex flex-col gap-1">
      <span 
        className="text-main-dark"
        style={{
          fontFamily: 'var(--font-sora)',
          fontSize: '14px',
          fontWeight: '700'
        }}
      >
        {user.name}
      </span>
      <span 
        className="text-second-dark"
        style={{
          fontFamily: 'var(--font-sora)',
          fontSize: '12px',
          fontWeight: '400'
        }}
      >
        {user.email}
      </span>
    </div>
  </div>
);

const UserProfileModalAction = ({ 
  icon: Icon, 
  children, 
  onClick 
}: { 
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-[260px] mx-4 px-4 py-3 flex items-center gap-3 text-left hover:bg-muted/50 transition-colors text-main-dark rounded-md"
    style={{
      fontFamily: 'var(--font-sora)',
      fontSize: '14px',
      fontWeight: '400'
    }}
  >
    <Icon className="w-4 h-4 text-second-primary" />
    {children}
  </button>
);

const UserProfileModalLogoutButton = ({ onClick }: { onClick?: () => void }) => (
  <div className="px-4 pb-4 pt-2">
    <Button
      onClick={onClick}
      className="w-full h-8 bg-main-danger hover:bg-main-danger/90 text-main-white flex items-center justify-center gap-2"
      style={{
        fontFamily: 'var(--font-sora)',
        fontSize: '14px',
        fontWeight: '500'
      }}
    >
      Desconectar
      <LogOut className="w-4 h-4" />
    </Button>
  </div>
);

const UserProfileModal = ({ 
  user, 
  onEditInfo, 
  onChangePassword, 
  onLogout, 
  trigger 
}: UserProfileModalProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent 
        className="w-[292px] p-0 bg-white border shadow-lg rounded-lg"
        align="end"
        sideOffset={8}
      >
        <UserProfileModalHeader>
          Perfil
        </UserProfileModalHeader>
        
        <UserProfileModalUserInfo user={user} />
        
        <div className="h-px bg-second-white mx-4" />
        
        <div className="py-2">
          <UserProfileModalAction 
            icon={Edit} 
            onClick={onEditInfo}
          >
            Editar Informações
          </UserProfileModalAction>
          
          <UserProfileModalAction 
            icon={KeyRound} 
            onClick={onChangePassword}
          >
            Alterar Senha
          </UserProfileModalAction>
        </div>
        
        <UserProfileModalLogoutButton onClick={onLogout} />
      </PopoverContent>
    </Popover>
  );
};

// Attach subcomponents
UserProfileModal.Header = UserProfileModalHeader;
UserProfileModal.UserInfo = UserProfileModalUserInfo;
UserProfileModal.Action = UserProfileModalAction;
UserProfileModal.LogoutButton = UserProfileModalLogoutButton;

export { 
  UserProfileModal,
  UserProfileModalHeader,
  UserProfileModalUserInfo,
  UserProfileModalAction,
  UserProfileModalLogoutButton
};