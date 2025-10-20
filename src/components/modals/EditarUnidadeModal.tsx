import React from 'react';
import { CadastrarUnidadeModal } from './CadastrarUnidadeModal';

interface EditarUnidadeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
  unidade: any;
}

export const EditarUnidadeModal: React.FC<EditarUnidadeModalProps> = ({
  open,
  onOpenChange,
  onSave,
  unidade
}) => {
  return (
    <CadastrarUnidadeModal
      open={open}
      onOpenChange={onOpenChange}
      onSave={onSave}
      editData={unidade}
      isEditing={true}
    />
  );
};