import React from 'react';
import { Modal } from '@/components/ui/modal';
import { UserActionHistory, UserAction } from '@/components/ui/user-action-history';

export interface HistoricoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  actions: UserAction[];
}

const HistoricoModal = ({ 
  open, 
  onOpenChange, 
  title = "Histórico de Ações",
  actions 
}: HistoricoModalProps) => {

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      className="sm:max-w-4xl"
    >
      <UserActionHistory 
        actions={actions}
        className="border-none p-0"
      />
    </Modal>
  );
};

export { HistoricoModal };